/**
 * Email queue processing for Baraja Studio
 * In-memory queue with retry logic and fallback
 */

import { sendEmail } from '@/util/email/resend';

// Email job interface
interface EmailJob {
  id: string;
  type: 'appointment_confirmation' | 'appointment_notification';
  data: {
    to: {
      email: string;
      hora: string;
      name: string;
      tipos: string[];
      phone: string;
      persona: string;
    }[];
  };
  attempts: number;
  maxAttempts: number;
  createdAt: number;
  processAt: number; // Delayed processing timestamp
  lastError?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

// Queue statistics
interface QueueStats {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  totalProcessed: number;
  averageProcessingTime: number;
  lastProcessedAt?: number;
}

class EmailQueue {
  private jobs = new Map<string, EmailJob>();
  private processing = new Set<string>();
  private stats: QueueStats = {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    totalProcessed: 0,
    averageProcessingTime: 0
  };
  private processingInterval: NodeJS.Timeout;
  private readonly maxConcurrency = 3;
  private readonly retryDelays = [1000, 5000, 30000]; // 1s, 5s, 30s

  constructor() {
    // Start processing loop
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, 1000); // Process every second

    // Cleanup completed jobs every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Add email job to queue
   */
  async addJob(
    type: EmailJob['type'],
    data: EmailJob['data'],
    delayMs: number = 0
  ): Promise<string> {
    const jobId = this.generateJobId();
    const now = Date.now();

    const job: EmailJob = {
      id: jobId,
      type,
      data,
      attempts: 0,
      maxAttempts: 3,
      createdAt: now,
      processAt: now + delayMs,
      status: 'pending'
    };

    this.jobs.set(jobId, job);
    this.updateStats();

    console.log(`Email job ${jobId} added to queue (type: ${type})`);
    return jobId;
  }

  /**
   * Process pending jobs
   */
  private async processQueue(): Promise<void> {
    // Don't process if we're at max concurrency
    if (this.processing.size >= this.maxConcurrency) {
      return;
    }

    const now = Date.now();
    const pendingJobs = Array.from(this.jobs.values())
      .filter(job => 
        job.status === 'pending' && 
        job.processAt <= now &&
        !this.processing.has(job.id)
      )
      .sort((a, b) => a.createdAt - b.createdAt); // FIFO

    // Process available jobs
    const jobsToProcess = pendingJobs.slice(0, this.maxConcurrency - this.processing.size);
    
    for (const job of jobsToProcess) {
      this.processJob(job).catch(error => {
        console.error(`Error processing job ${job.id}:`, error);
      });
    }
  }

  /**
   * Process individual job
   */
  private async processJob(job: EmailJob): Promise<void> {
    if (this.processing.has(job.id)) {
      return; // Already processing
    }

    this.processing.add(job.id);
    job.status = 'processing';
    job.attempts++;
    this.updateStats();

    const startTime = Date.now();

    try {
      console.log(`Processing email job ${job.id} (attempt ${job.attempts})`);

      // Process the email job
      await this.executeEmailJob(job);

      // Mark as completed
      job.status = 'completed';
      this.stats.totalProcessed++;
      this.stats.lastProcessedAt = Date.now();

      // Update average processing time
      const processingTime = Date.now() - startTime;
      this.stats.averageProcessingTime = 
        (this.stats.averageProcessingTime * (this.stats.totalProcessed - 1) + processingTime) / 
        this.stats.totalProcessed;

      console.log(`Email job ${job.id} completed successfully`);

    } catch (error) {
      console.error(`Email job ${job.id} failed:`, error);
      job.lastError = error instanceof Error ? error.message : 'Unknown error';

      if (job.attempts >= job.maxAttempts) {
        // Mark as failed
        job.status = 'failed';
        console.error(`Email job ${job.id} permanently failed after ${job.attempts} attempts`);
      } else {
        // Schedule retry
        job.status = 'pending';
        const delay = this.retryDelays[job.attempts - 1] || this.retryDelays[this.retryDelays.length - 1];
        job.processAt = Date.now() + delay;
        console.log(`Email job ${job.id} will retry in ${delay}ms`);
      }
    } finally {
      this.processing.delete(job.id);
      this.updateStats();
    }
  }

  /**
   * Execute the actual email sending
   */
  private async executeEmailJob(job: EmailJob): Promise<void> {
    switch (job.type) {
      case 'appointment_confirmation':
      case 'appointment_notification':
        await sendEmail(job.data);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  /**
   * Get job status
   */
  getJob(jobId: string): EmailJob | undefined {
    return this.jobs.get(jobId);
  }

  /**
   * Get queue statistics
   */
  getStats(): QueueStats {
    return { ...this.stats };
  }

  /**
   * Get all jobs (for debugging)
   */
  getAllJobs(): EmailJob[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Get jobs by status
   */
  getJobsByStatus(status: EmailJob['status']): EmailJob[] {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  /**
   * Cancel job
   */
  cancelJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status === 'processing' || job.status === 'completed') {
      return false;
    }

    this.jobs.delete(jobId);
    this.updateStats();
    return true;
  }

  /**
   * Retry failed job
   */
  retryJob(jobId: string): boolean {
    const job = this.jobs.get(jobId);
    if (!job || job.status !== 'failed') {
      return false;
    }

    job.status = 'pending';
    job.attempts = 0;
    job.processAt = Date.now();
    job.lastError = undefined;
    this.updateStats();

    return true;
  }

  /**
   * Clear completed and failed jobs
   */
  private cleanup(): void {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours
    let cleanedCount = 0;

    for (const [jobId, job] of this.jobs.entries()) {
      if (
        (job.status === 'completed' || job.status === 'failed') &&
        job.createdAt < cutoff
      ) {
        this.jobs.delete(jobId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      this.updateStats();
      console.log(`Email queue cleanup: removed ${cleanedCount} old jobs`);
    }
  }

  /**
   * Update internal statistics
   */
  private updateStats(): void {
    const jobs = Array.from(this.jobs.values());
    
    this.stats.pending = jobs.filter(j => j.status === 'pending').length;
    this.stats.processing = jobs.filter(j => j.status === 'processing').length;
    this.stats.completed = jobs.filter(j => j.status === 'completed').length;
    this.stats.failed = jobs.filter(j => j.status === 'failed').length;
  }

  /**
   * Generate unique job ID
   */
  private generateJobId(): string {
    return `email_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Shutdown queue processing
   */
  shutdown(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    
    // Wait for processing jobs to complete
    const maxWait = 30000; // 30 seconds
    const startTime = Date.now();
    
    const checkProcessing = () => {
      if (this.processing.size === 0 || Date.now() - startTime > maxWait) {
        console.log('Email queue shutdown complete');
        return;
      }
      
      setTimeout(checkProcessing, 1000);
    };
    
    checkProcessing();
  }
}

// Create singleton instance
export const emailQueue = new EmailQueue();

// Convenience functions
export async function queueAppointmentEmail(appointmentData: {
  name: string;
  phone: string;
  mail: string; 
  hora: string;
  tipos: string[];
  persona: string;
}): Promise<string> {
  const emailData = {
    to: [{
      email: appointmentData.mail,
      hora: appointmentData.hora,
      name: appointmentData.name,
      tipos: appointmentData.tipos,
      phone: appointmentData.phone,
      persona: appointmentData.persona
    }]
  };

  return await emailQueue.addJob('appointment_confirmation', emailData);
}

export async function queueNotificationEmail(appointmentData: {
  name: string;
  phone: string;
  mail: string;
  hora: string;
  tipos: string[];
  persona: string;
}): Promise<string> {
  const emailData = {
    to: [{
      email: appointmentData.mail,
      hora: appointmentData.hora,
      name: appointmentData.name,
      tipos: appointmentData.tipos,
      phone: appointmentData.phone,
      persona: appointmentData.persona
    }]
  };

  return await emailQueue.addJob('appointment_notification', emailData, 1000); // 1 second delay
}

// Cleanup on process exit
process.on('SIGTERM', () => {
  console.log('Shutting down email queue on SIGTERM');
  emailQueue.shutdown();
});

process.on('SIGINT', () => {
  console.log('Shutting down email queue on SIGINT');
  emailQueue.shutdown();
});
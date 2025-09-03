🎯 SIMPLIFIED IMPLEMENTATION PLAN

GOAL:

- Specific time slots per day for each hairdresser (Monday 8-12 & 14-18, Tuesday 8-16, Saturday off, etc.)
- Dynamic slot interval (stored in DB, but hardcoded to 30min at creation)
- Keep current appointment process UNCHANGED
- Easy admin interface for day-specific scheduling (either on create or edit a hairdresser)

---

📊 NEW DATA STRUCTURE

export interface DaySchedule {
dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
isWorkingDay: boolean;
workingPeriods: WorkingPeriod[]; // Multiple periods per day
slotInterval: number; // Minutes per slot (30 for now, dynamic later)
}

export interface Hairdresser {
id: string;
name: string;
email: string;
phone: string;
photo?: string;
services: string[];
schedule: {
weeklySchedule: DaySchedule[]; // 7 objects, one per day
defaultSlotInterval: number; // Global default (30min)
};
isActive: boolean;
createdAt: string;
updatedAt: string;
}

---

🚀 IMPLEMENTATION STEPS

Step 1: Update Types & Core Logic

1. Update /src/util/types.ts with new interfaces
2. Update /src/util/dynamicScheduling.ts:

   - Modify generateHairdresserTimeSlots() to use day-specific schedules
   - Keep 30min intervals but read from slotInterval field
   - Maintain all existing function signatures

Step 2: Update Admin Interface

1. Replace hairdresser modal schedule section with:

   - Weekly schedule editor (7 days)
   - Per-day working periods
   - Per-day working status toggle

2. Keep existing UI style and behavior
3. Add default initialization (all days 9-18, 30min intervals)

Step 3: Database Migration

1. Create migration logic for existing hairdressers
2. Convert old schedule.workingPeriods to weeklySchedule
3. Set defaultSlotInterval: 30 for all existing records

---

🎨 UI DESIGN (KEEPING CURRENT STYLE)

// Replace current schedule section with:

  <div className="space-y-4">
    <Label>Horarios de trabajo por día</Label>

    {weekDays.map(day => (
      <DayScheduleCard
        key={day.key}
        day={day}
        schedule={formData.schedule.weeklySchedule.find(d => d.dayOfWeek === day.key)}
        onUpdate={handleDayScheduleUpdate}
      />
    ))}

  </div>

// Each day card:
const DayScheduleCard = ({ day, schedule, onUpdate }) => (

<div className="border rounded-lg p-3">
<div className="flex items-center justify-between mb-2">
<Label>{day.label}</Label>
<Switch
checked={schedule.isWorkingDay}
onCheckedChange={(checked) => onUpdate(day.key, 'isWorkingDay', checked)}
/>
</div>

      {schedule.isWorkingDay && (
        <div className="space-y-2">
          {schedule.workingPeriods.map((period, index) => (
            <WorkingPeriodRow key={index} period={period} onChange={...} />
          ))}
          <Button size="sm" onClick={() => addPeriod(day.key)}>+ Agregar horario</Button>
        </div>
      )}
    </div>

);

---

🔧 CORE ALGORITHM CHANGES

// Updated generateHairdresserTimeSlots function:
export const generateHairdresserTimeSlots = (hairdresser: Hairdresser, selectedDate: Date): TimeSlot[] => {
const dayOfWeek = getDayOfWeek(selectedDate);

    // Find specific day schedule
    const daySchedule = hairdresser.schedule.weeklySchedule.find(
      day => day.dayOfWeek === dayOfWeek
    );

    if (!daySchedule?.isWorkingDay) {
      return []; // No work this day
    }

    const slots: TimeSlot[] = [];
    const interval = daySchedule.slotInterval || hairdresser.schedule.defaultSlotInterval || 30;

    // Generate slots for each working period of this specific day
    for (const period of daySchedule.workingPeriods) {
      const startTime = parseTime(period.startTime);
      const endTime = parseTime(period.endTime);

      let currentTime = startTime;
      while (currentTime < endTime) {
        slots.push({
          time: formatTime(currentTime),
          available: true,
        });
        currentTime += interval;
      }
    }

    return slots;

};

---

📁 FILES TO MODIFY

1. /src/util/types.ts - New interfaces
2. /src/util/dynamicScheduling.ts - Core scheduling logic
3. /src/app/panel/hairdressers/\_components/HairdressersModals/HairdressersCreateModal.tsx - Create form
4. /src/app/panel/hairdressers/\_components/HairdressersModals/HairdressersEditModal.tsx - Edit form
5. /src/app/panel/hairdressers/page.tsx - Form data handling

---

✅ WHAT STAYS THE SAME

- ✅ Appointment booking process (unchanged)
- ✅ 30-minute slot intervals (for now)
- ✅ Current UI/UX style and behavior
- ✅ All existing function signatures
- ✅ Database appointment structure
- ✅ Frontend booking components

---

🎯 DELIVERABLES

1. Day-specific scheduling for each hairdresser
2. Easy admin interface for setting per-day hours
3. Dynamic slot intervals (stored in DB, defaulted to 30min)
4. Backward compatibility with existing appointments
5. No changes to booking flow

---

Ready to proceed? I'll start with Step 1 (Types & Core Logic), then move to Step 2 (Admin Interface), and finally Step 3 (Migration). The entire appointment
process will remain unchanged, and admins will get a much more flexible scheduling system.

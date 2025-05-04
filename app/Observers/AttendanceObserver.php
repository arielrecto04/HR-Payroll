<?php

namespace App\Observers;

use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceObserver
{
    /**
     * Handle the Attendance "saving" event.
     */
    public function saving(Attendance $attendance)
    {
        // Skip if marked as absent
        if ($attendance->is_absent) {
            $attendance->days_worked = 0;
            return;
        }

        // Calculate days worked if time_in and time_out are set
        if ($attendance->time_in && $attendance->time_out) {
            $attendance->days_worked = Attendance::calculateDaysWorked(
                $attendance->time_in,
                $attendance->time_out
            );
        }
    }
}
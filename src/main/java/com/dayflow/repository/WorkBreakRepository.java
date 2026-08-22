package com.dayflow.repository;

import com.dayflow.entity.Attendance;
import com.dayflow.entity.WorkBreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkBreakRepository extends JpaRepository<WorkBreak, Long> {
    List<WorkBreak> findByAttendanceId(Long attendanceId);
    Optional<WorkBreak> findFirstByAttendanceAndEndTimeIsNull(Attendance attendance);
}

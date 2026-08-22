package com.dayflow.repository;

import com.dayflow.entity.User;
import com.dayflow.enums.Role;
import com.dayflow.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmployeeId(String employeeId);
    Optional<User> findByVerificationToken(String verificationToken);
    boolean existsByEmail(String email);
    boolean existsByEmployeeId(String employeeId);
    List<User> findByRole(Role role);
    List<User> findByStatus(UserStatus status);
}

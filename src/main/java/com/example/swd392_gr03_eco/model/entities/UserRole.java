package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "user_roles")
// Use specific annotations to break the recursive loop
@Getter
@Setter
@ToString(exclude = {"user", "role"})
@EqualsAndHashCode(exclude = {"user", "role"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(UserRole.UserRoleId.class)
public class UserRole {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    public static class UserRoleId implements Serializable {
        private Integer user;
        private Integer role;

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            UserRoleId that = (UserRoleId) o;
            return Objects.equals(user, that.user) && Objects.equals(role, that.role);
        }

        @Override
        public int hashCode() {
            return Objects.hash(user, role);
        }
    }
}

package com.app.departmentservice.repository;

import com.app.departmentservice.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
//    private List<Department> departments
//            = new ArrayList<>();
//
//    public Department addDepartment(Department department) {
//        departments.add(department);
//        return department;
//    }
//
//    public Department findById(Long id) {
//        return departments.stream()
//                .filter(department ->
//                        department.getId().equals(id))
//                .findFirst()
//                .orElseThrow();
//    }
//
//    public List<Department> findAll() {
//        return departments;
//    }

}

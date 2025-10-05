import { Component, OnInit } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Employee } from '../../Models/employee';
import { EmployeeService } from '../employee.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = {
    id: 0,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    position: ''
  }

  isEditing: boolean = false;

  errorMessage : string = "";

  constructor(private employeeService: EmployeeService, 
    private router: Router,
    private route : ActivatedRoute
  )  {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        // Editing employee
        this.isEditing = true;
        this.employeeService.getEmployeeById(Number(id)).subscribe({
          next: (result) => (this.employee = result),
          error: (err) => {
            this.errorMessage = `Error occurred while fetching employee: (${err.status}) ${err.message}`;
          },
        });
      } else {
        // Creating a new employee
        this.isEditing = false;
      }
    });
  }

  onSubmit(): void {
    if (this.isEditing) {
      // Update existing employee
      this.employeeService.updateEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.errorMessage = `Error occurred while updating employee: (${err.status}) ${err.message}`;
        },
      });
    } else {
      // Create new employee
      this.employeeService.createEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/employees']);
        },
        error: (err) => {
          this.errorMessage = `Error occurred while creating employee: (${err.status}) ${err.message}`;
        },
      });
    }
  }
}

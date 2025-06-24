import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Iuser } from '../../models/user';

@Component({
  selector: 'app-user-list',
  standalone:false,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  page = 1;
  error = '';
  totalPages = 1;
  loading = false;
  userList: Iuser[] = [];
  sortByField = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';

    this.userService.getUsers(this.page).subscribe({
      next: (response) => {
        this.userList = response.data;
        this.totalPages = response.total_pages;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again later.';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadUsers();
    }
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadUsers();
    }
  }

  editUser(user: Iuser): void {
    this.router.navigate(['/edit', user.id]);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User Deleted Successfully!');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Error deleting user:', err);
        }
      });
    }
  }

  sortBy(field: string) {
    if (this.sortByField === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortByField = field;
      this.sortOrder = 'asc';
    }

    this.userList = [...this.userList].sort((a, b) => {
      const valueA = field === 'id' ? a.id : a[field as keyof Iuser]?.toString().toLowerCase() || '';
      const valueB = field === 'id' ? b.id : b[field as keyof Iuser]?.toString().toLowerCase() || '';

      if (valueA < valueB) return this.sortOrder === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forbiddenNameValidator } from '../../validators/forbidden-name.validator';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEdit = false;
  userId!: number;
  imagePreview: string | ArrayBuffer | null = null;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2),
      forbiddenNameValidator(['admin', 'test', 'superuser'])]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      avatar: ['', Validators.required]
    });

    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.userId) {
      this.isEdit = true;
      this.userService.getUser(this.userId).subscribe((res) => {
        const user = res.data;
        this.userForm.patchValue({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          avatar: user.avatar
        });
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.userForm.patchValue({ avatar: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;
    if (this.userForm.invalid) return;

    const formData = this.userForm.value;
    if (this.isEdit) {
      this.userService.updateUser(this.userId, formData).subscribe(() => {
        alert('User updated successfully');
        console.log('User Updated Successfully: ', formData);
        this.router.navigate(['/']);
      });
    } else {
      this.userService.addUser(formData).subscribe(() => {
        alert('User added successfully');
        console.log('User Added Successfully: ', formData);
        this.router.navigate(['/']);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['']);
  }

}

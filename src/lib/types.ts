export interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  status?: "Active" | "Inactive";
  courses?: string[];
  enrolledCourses?: string[];
}

export interface Course {
  courseCode: string; // ตาม README
  courseId?: string;  // เพิ่มเผื่อไว้ป้องกัน error จุดอื่น
  courseTitle: string;
  instructors?: string[];
}

export interface Enrollment {
  studentId: string;
  courseCode?: string; // ตาม README
  courseId?: string;  // เพิ่มเผื่อไว้
}
interface Student {
  studentId: string;
  firstName: string;
  lastName: string;
  program: "CPE" | "ISNE";
  status?: "Active" | "Inactive";
  courses?: string[];
  enrolledCourses?: string[];
}

interface Course {
  courseCode: string;
  courseId?: string;
  courseTitle: string;
  instructors?: string[];
}

interface Enrollment {
  studentId: string;
  courseCode?: string;
  courseId?: string;
}

export type { Student, Course, Enrollment };
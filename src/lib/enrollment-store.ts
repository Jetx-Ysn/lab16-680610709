import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  students as initialStudents,
  courses as initialCourses,
  enrollments as initialEnrollments,
} from "@/lib/mock-data";
import type { Course, Enrollment, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];
  enroll: (studentId: string, courseCode: string) => void;
  drop: (studentId: string, courseCode: string) => void;
  enrollMultiple: (courseCode: string, studentIds: string[]) => void;
  removeStudent: (studentId: string) => void;
  removeCourse: (courseCode: string) => void;
  updateCourse: (courseCode: string, updatedData: Partial<Course>) => void;
  addCourse: (course: Course) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,
      enrollments: initialEnrollments,

      enroll: (studentId, courseCode) =>
        set((state) => ({
          enrollments: state.enrollments.some(
            (e) => (e.courseCode || e.courseId) === courseCode && e.studentId === studentId
          )
            ? state.enrollments
            : [...state.enrollments, { studentId, courseCode }],
        })),

      drop: (studentId, courseCode) =>
        set((state) => ({
          enrollments: state.enrollments.filter(
            (e) => !((e.courseCode || e.courseId) === courseCode && e.studentId === studentId)
          ),
        })),

      enrollMultiple: (courseCode, studentIds) =>
        set((state) => {
          const currentEnrollments = [...state.enrollments];
          const filtered = currentEnrollments.filter(
            (e) => (e.courseCode || e.courseId) !== courseCode
          );
          const newEntries: Enrollment[] = studentIds.map((studentId) => ({
            studentId,
            courseCode,
          }));
          return { enrollments: [...filtered, ...newEntries] };
        }),

      removeStudent: (studentId) =>
        set((state) => ({
          students: state.students.filter((s) => s.studentId !== studentId),
          enrollments: state.enrollments.filter((e) => e.studentId !== studentId),
        })),

      removeCourse: (courseCode) =>
        set((state) => ({
          courses: state.courses.filter((c) => (c.courseCode || c.courseId) !== courseCode),
          enrollments: state.enrollments.filter((e) => (e.courseCode || e.courseId) !== courseCode),
        })),

      updateCourse: (courseCode, updatedData) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            (c.courseCode || c.courseId) === courseCode ? { ...c, ...updatedData } : c
          ),
        })),

      addCourse: (course) =>
        set((state) => {
          const code = course.courseCode || course.courseId || "";
          const exists = state.courses.some(
            (c) => (c.courseCode || c.courseId) === code
          );
          if (exists) return state;
          return { courses: [...state.courses, course] };
        }),
    }),
    {
      name: "lab16-2569-680610709",
    }
  )
);
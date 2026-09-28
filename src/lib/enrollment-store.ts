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
  /** Admin ลงทะเบียนวิชาให้นักศึกษาคนใดก็ได้ (ไม่ซ้ำกับที่มีอยู่แล้ว) */
  enroll: (studentId: string, courseId: string) => void;
  /** Admin ยกเลิกการลงทะเบียนของนักศึกษาคนใดก็ได้ */
  drop: (studentId: string, courseId: string) => void;
  /** ลงทะเบียนนักศึกษาหลายคนในวิชาเดียวพร้อมกัน */
  enrollMultiple: (courseId: string, studentIds: string[]) => void;
  /** ลบนักศึกษา พร้อมการลงทะเบียนทั้งหมดของคนนั้น */
  removeStudent: (studentId: string) => void;
  /** ลบวิชาออกจากรายวิชาที่เปิดสอน พร้อม cascade ลบ enrollment ที่อ้างถึงวิชานั้นทั้งหมด */
  removeCourse: (courseId: string) => void;
  /** อัปเดตข้อมูลรายวิชา (เช่น แก้ไขรายชื่อผู้สอน) */
  updateCourse: (courseId: string, updatedData: Partial<Course>) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,
      enrollments: initialEnrollments,

      enroll: (studentId, courseId) =>
        set((state) => ({
          enrollments: state.enrollments.some(
            (e) => e.studentId === studentId && e.courseId === courseId
          )
            ? state.enrollments
            : [...state.enrollments, { studentId, courseId }],
        })),

      drop: (studentId, courseId) =>
        set((state) => ({
          enrollments: state.enrollments.filter(
            (e) => !(e.studentId === studentId && e.courseId === courseId)
          ),
        })),

      // ฟังก์ชันช่วยสำหรับเพิ่มนักศึกษาหลายคนในวิชาเดียว (ใช้ในหน้า Enrollments)
      enrollMultiple: (courseId, studentIds) =>
        set((state) => {
          const currentEnrollments = [...state.enrollments];
          
          const filtered = currentEnrollments.filter((e) => e.courseId !== courseId);
          const newEntries: Enrollment[] = studentIds.map((studentId) => ({
            studentId,
            courseId,
          }));

          return { enrollments: [...filtered, ...newEntries] };
        }),

      removeStudent: (studentId) =>
        set((state) => ({
          students: state.students.filter((s) => s.studentId !== studentId),
          enrollments: state.enrollments.filter((e) => e.studentId !== studentId),
        })),

      removeCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseId !== courseId),
          enrollments: state.enrollments.filter((e) => e.courseId !== courseId),
        })),

      updateCourse: (courseId, updatedData) =>
        set((state) => ({
          courses: state.courses.map((c) =>
            c.courseId === courseId ? { ...c, ...updatedData } : c
          ),
        })),
    }),
    {
      name: "lab16-2569-680610709", // LocalStorage Key ตามรหัสนักศึกษาของคุณ
    }
  )
);
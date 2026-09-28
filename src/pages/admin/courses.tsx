import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export default function AdminCoursesPage() {
  const { courses, addCourse, removeCourse, updateCourse } = useEnrollmentStore();

  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [instructorInput, setInstructorInput] = useState("");
  const [instructors, setInstructors] = useState<string[]>([]);

  // เพิ่มชื่อผู้สอนลงในรายการชั่วคราวขณะสร้างวิชา
  const handleAddInstructor = () => {
    if (instructorInput.trim() && !instructors.includes(instructorInput.trim())) {
      setInstructors([...instructors, instructorInput.trim()]);
      setInstructorInput("");
    }
  };

  // บันทึกเพิ่มวิชาใหม่
  const handleSaveCourse = () => {
    if (!courseId.trim() || !courseTitle.trim()) return;
    
    addCourse({
      courseId: courseId.trim(),
      courseTitle: courseTitle.trim(),
      instructors: instructors.length > 0 ? instructors : ["ไม่ระบุผู้สอน"],
    });

    // รีเซ็ตฟอร์มและปิด Dialog
    setCourseId("");
    setCourseTitle("");
    setInstructors([]);
    setInstructorInput("");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">จัดการวิชาเรียน</h1>
          <p className="text-sm text-muted-foreground">
            {courses.length} วิชา — เพิ่มวิชาใหม่ที่นี่แล้วจะไปโผล่เป็นตัวเลือก ตอนลงทะเบียนให้นักศึกษาที่หน้า "จัดการการลงทะเบียน" ทันที
          </p>
        </div>

        {/* ปุ่มเพิ่มวิชา */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> เพิ่มวิชา
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
              <DialogDescription>
                วิชาที่เพิ่มจะไปโผล่เป็นตัวเลือกตอนลงทะเบียนให้นักศึกษาได้ทันที
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-1.5">
                <Label htmlFor="courseId">รหัสวิชา</Label>
                <Input
                  id="courseId"
                  placeholder="เช่น CPE303"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="courseTitle">ชื่อวิชา</Label>
                <Input
                  id="courseTitle"
                  placeholder="เช่น Mobile Application Development"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="instructor">ผู้สอน</Label>
                <div className="flex gap-2">
                  <Input
                    id="instructor"
                    placeholder="เลือกหรือพิมพ์ชื่อผู้สอน (ได้หลายคน)"
                    value={instructorInput}
                    onChange={(e) => setInstructorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddInstructor();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={handleAddInstructor}>
                    เพิ่ม
                  </Button>
                </div>

                {/* แสดงรายชื่อผู้สอนที่เพิ่มเข้ามาแบบ Badge */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {instructors.map((inst, index) => (
                    <Badge key={index} variant="secondary" className="gap-1 px-2.5 py-1">
                      {inst}
                      <button
                        type="button"
                        onClick={() =>
                          setInstructors(instructors.filter((_, i) => i !== index))
                        }
                        className="text-muted-foreground hover:text-foreground ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={!courseId.trim() || !courseTitle.trim()}
                onClick={handleSaveCourse}
              >
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ตารางแสดงรายวิชา */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">รหัสวิชา</TableHead>
              <TableHead className="w-[320px]">ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead className="w-[80px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  ไม่พบข้อมูลรายวิชา
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course.courseId}>
                  <TableCell className="font-medium">{course.courseId}</TableCell>
                  <TableCell>{course.courseTitle}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {course.instructors && course.instructors.length > 0 ? (
                        course.instructors.map((inst, idx) => (
                          <Badge key={idx} variant="secondary" className="gap-1.5 py-1">
                            {inst}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedInstructors = course.instructors.filter((_, i) => i !== idx);
                                updateCourse(course.courseId, {
                                  ...course,
                                  instructors: updatedInstructors.length > 0 ? updatedInstructors : ["ไม่ระบุผู้สอน"],
                                });
                              }}
                              className="text-muted-foreground hover:text-foreground ml-0.5 cursor-pointer"
                              title="ลบผู้สอน"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm italic">
                          ไม่ระบุผู้สอน
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCourse(course.courseId)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="ลบรายวิชา"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
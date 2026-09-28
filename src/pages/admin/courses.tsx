import { useState } from "react";
import { PlusCircle, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";
import { Badge } from "@/components/ui/badge";

export default function AdminCoursesPage() {
  const { courses, addCourse, updateCourse, removeCourse, enrollments } = useEnrollmentStore();

  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [instructorInput, setInstructorInput] = useState("");
  const [instructors, setInstructors] = useState<string[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddInstructor = () => {
    if (instructorInput.trim() && !instructors.includes(instructorInput.trim())) {
      setInstructors([...instructors, instructorInput.trim()]);
      setInstructorInput("");
    }
  };

  const handleCreateCourse = () => {
    if (!courseCode.trim() || !courseTitle.trim()) return;
    const finalCode = courseCode.trim();
    addCourse({
      courseCode: finalCode,
      courseId: finalCode,
      courseTitle: courseTitle.trim(),
      instructors: instructors.length > 0 ? instructors : ["ไม่ระบุผู้สอน"],
    });
    setAddDialogOpen(false);
    setCourseCode("");
    setCourseTitle("");
    setInstructors([]);
    setInstructorInput("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">จัดการรายวิชา</h1>
          <p className="text-sm text-muted-foreground">
            เพิ่ม แก้ไข หรือลบรายวิชาในระบบ
          </p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger>
            <div className="inline-flex">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" /> เพิ่มรายวิชา
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>เพิ่มรายวิชาใหม่</DialogTitle>
              <DialogDescription>
                กรอกข้อมูลรหัสวิชา ชื่อวิชา และผู้สอน
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="courseCode">รหัสวิชา</Label>
                <Input
                  id="courseCode"
                  placeholder="เช่น 261207"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="courseTitle">ชื่อวิชา</Label>
                <Input
                  id="courseTitle"
                  placeholder="เช่น Data Structures"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="instructor">ผู้สอน</Label>
                <div className="flex gap-2">
                  <Input
                    id="instructor"
                    placeholder="ชื่อผู้สอน"
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
                <div className="flex flex-wrap gap-1 mt-1">
                  {instructors.map((ins, idx) => (
                    <Badge key={idx} variant="secondary" className="gap-1">
                      {ins}
                      <button
                        type="button"
                        onClick={() =>
                          setInstructors(instructors.filter((_, i) => i !== idx))
                        }
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateCourse} disabled={!courseCode.trim() || !courseTitle.trim()}>
                บันทึก
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[130px]">รหัสวิชา</TableHead>
              <TableHead className="w-[250px]">ชื่อวิชา</TableHead>
              <TableHead>ผู้สอน</TableHead>
              <TableHead className="w-[100px] text-center">นศ. ที่ลง</TableHead>
              <TableHead className="w-[80px] text-right">จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  ไม่พบข้อมูลรายวิชา
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => {
                const cCode = course.courseCode || course.courseId || "";
                const enrolledCount = enrollments.filter(
                  (e) => (e.courseCode || e.courseId) === cCode
                ).length;
                const courseInstructors = course.instructors || [];

                return (
                  <TableRow key={cCode}>
                    <TableCell className="font-medium">{cCode}</TableCell>
                    <TableCell>{course.courseTitle}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {courseInstructors.map((ins, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {ins}
                            <button
                              type="button"
                              className="ml-1 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                const updatedInstructors = courseInstructors.filter((_, i) => i !== idx);
                                updateCourse(cCode, {
                                  instructors: updatedInstructors.length > 0 ? updatedInstructors : ["ไม่ระบุผู้สอน"],
                                });
                              }}
                            >
                              <X className="h-2.5 w-2.5" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">{enrolledCount}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeCourse(cCode)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
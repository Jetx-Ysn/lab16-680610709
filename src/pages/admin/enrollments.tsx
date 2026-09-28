import { useState } from "react";
import { PlusCircle, X } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

export default function AdminEnrollmentsPage() {
  const { students, courses, enrollments, enrollMultiple, drop } = useEnrollmentStore();

  const [selectedCourseCode, setSelectedCourseCode] = useState<string>("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);

  const [searchMode, setSearchMode] = useState<"course" | "student">("course");
  const [filterValue, setFilterValue] = useState<string>("all");

  const availableStudents = students.filter(
    (s) =>
      !enrollments.some(
        (e) => (e.courseCode || e.courseId) === selectedCourseCode && e.studentId === s.studentId
      )
  );

  const handleEnroll = () => {
    if (!selectedCourseCode || selectedStudentIds.length === 0) return;
    enrollMultiple(selectedCourseCode, selectedStudentIds);
    setEnrollDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setEnrollDialogOpen(open);
    if (!open) {
      setSelectedCourseCode("");
      setSelectedStudentIds([]);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const cCode = course.courseCode || course.courseId || "";

    if (searchMode === "student" && filterValue !== "all") {
      const hasStudent = enrollments.some(
        (e) => (e.courseCode || e.courseId) === cCode && e.studentId === filterValue
      );
      if (!hasStudent) return false;
    }

    if (searchMode === "course" && filterValue !== "all") {
      if (cCode !== filterValue) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">จัดการการลงทะเบียน</h1>
          <p className="text-sm text-muted-foreground">
            Admin ลงทะเบียนและยกเลิกการลงทะเบียนให้นักศึกษาได้ทุกคน
          </p>
        </div>

        <Dialog open={enrollDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger>
            <div className="inline-flex">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" /> ลงทะเบียนให้นักศึกษา
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>ลงทะเบียนให้นักศึกษา</DialogTitle>
              <DialogDescription>
                เลือกวิชาก่อน แล้วเลือกนักศึกษาที่ยังไม่ได้ลงทะเบียนวิชานั้น (เลือกได้มากกว่า 1 คน)
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-2">
              <div className="grid gap-1.5">
                <Label htmlFor="courseSelect">วิชา</Label>
                <Select
                  value={selectedCourseCode}
                  onValueChange={(v) => {
                    if (v) {
                      setSelectedCourseCode(v);
                      setSelectedStudentIds([]);
                    }
                  }}
                >
                  <SelectTrigger id="courseSelect" className="w-full">
                    <SelectValue placeholder="เลือกวิชา" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => {
                      const cCode = c.courseCode || c.courseId || "";
                      return (
                        <SelectItem key={cCode} value={cCode}>
                          {cCode} — {c.courseTitle}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="studentSelect">นักศึกษา</Label>
                <Select
                  disabled={!selectedCourseCode}
                  value=""
                  onValueChange={(v) => {
                    if (v && !selectedStudentIds.includes(v)) {
                      setSelectedStudentIds([...selectedStudentIds, v]);
                    }
                  }}
                >
                  <SelectTrigger id="studentSelect" className="w-full">
                    <SelectValue
                      placeholder={
                        !selectedCourseCode
                          ? "เลือกวิชาก่อน"
                          : availableStudents.length === 0
                          ? "นักศึกษาลงทะเบียนครบทุกวิชาแล้ว"
                          : "เลือกนักศึกษาเพิ่ม"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStudents.map((s) => (
                      <SelectItem key={s.studentId} value={s.studentId}>
                        {s.studentId} — {s.firstName} {s.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedStudentIds.map((id) => {
                    const st = students.find((s) => s.studentId === id);
                    return (
                      <Badge key={id} variant="secondary" className="gap-1 px-2 py-1">
                        {st ? `${st.firstName} ${st.lastName}` : id}
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedStudentIds(
                              selectedStudentIds.filter((item) => item !== id)
                            )
                          }
                          className="text-muted-foreground hover:text-foreground ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                disabled={!selectedCourseCode || selectedStudentIds.length === 0}
                onClick={handleEnroll}
              >
                ลงทะเบียน ({selectedStudentIds.length} คน)
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={searchMode === "course" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setSearchMode("course");
            setFilterValue("all");
          }}
          className="rounded-full px-4"
        >
          ค้นหาวิชา
        </Button>
        <Button
          variant={searchMode === "student" ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setSearchMode("student");
            setFilterValue("all");
          }}
          className="rounded-full px-4"
        >
          ค้นหานักศึกษา
        </Button>
      </div>

      <div>
        <Select
          value={filterValue}
          onValueChange={(v) => {
            if (v) setFilterValue(v);
          }}
        >
          <SelectTrigger className="w-[260px]">
            <SelectValue placeholder="ทุกคน" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทุกคน</SelectItem>
            {searchMode === "course" ? (
              courses.map((c) => {
                const cCode = c.courseCode || c.courseId || "";
                return (
                  <SelectItem key={cCode} value={cCode}>
                    {cCode} {c.courseTitle}
                  </SelectItem>
                );
              })
            ) : (
              students.map((s) => (
                <SelectItem key={s.studentId} value={s.studentId}>
                  {s.studentId} {s.firstName} {s.lastName}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">รหัสวิชา</TableHead>
              <TableHead className="w-[280px]">ชื่อวิชา</TableHead>
              <TableHead className="w-[110px] text-center">จำนวน นศ.</TableHead>
              <TableHead>นักศึกษาที่ลงทะเบียน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  ไม่พบข้อมูลรายวิชา
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => {
                const cCode = course.courseCode || course.courseId || "";
                const enrolledInThisCourse = enrollments.filter(
                  (e) => (e.courseCode || e.courseId) === cCode
                );

                return (
                  <TableRow key={cCode}>
                    <TableCell className="font-medium">{cCode}</TableCell>
                    <TableCell>{course.courseTitle}</TableCell>
                    <TableCell className="text-center font-medium">
                      {enrolledInThisCourse.length}
                    </TableCell>
                    <TableCell>
                      {enrolledInThisCourse.length === 0 ? (
                        <span className="text-muted-foreground text-sm italic">
                          ยังไม่มีนักศึกษาลงทะเบียน
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {enrolledInThisCourse.map((e) => {
                            const st = students.find((s) => s.studentId === e.studentId);
                            return (
                              <Badge key={e.studentId} variant="outline" className="gap-1.5 py-1">
                                {st ? `${st.firstName} ${st.lastName}` : e.studentId}
                                <button
                                  type="button"
                                  onClick={() => drop(e.studentId, cCode)}
                                  className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                  title="ยกเลิกการลงทะเบียน"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            );
                          })}
                        </div>
                      )}
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
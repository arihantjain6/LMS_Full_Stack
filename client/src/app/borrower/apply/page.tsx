"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { CheckCircle2, FileUp, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { FormInput } from "@/components/forms/form-input";
import { FormSelect } from "@/components/forms/form-select";
import { MoneyValue } from "@/components/shared/money-value";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { LOAN_LIMITS, UPLOAD_LIMITS } from "@/lib/constants/loans";
import { calculateSimpleInterest, calculateTotalRepayment } from "@/lib/utils/loan-calculation";
import {
  loanApplicationSchema,
  personalDetailsSchema,
  type LoanApplicationValues,
  type PersonalDetailsValues,
} from "@/lib/validations/loan";
import { loanService } from "@/services/loan.service";
import { uploadService } from "@/services/upload.service";
import { useAuthStore } from "@/store/auth.store";

const employmentOptions = [
  { value: "SALARIED", label: "Salaried" },
  { value: "SELF_EMPLOYED", label: "Self employed" },
  { value: "UNEMPLOYED", label: "Unemployed" },
];

export default function BorrowerApplyPage() {
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const personalForm = useForm<PersonalDetailsValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      fullName: user?.borrowerProfile?.fullName ?? "",
      pan: user?.borrowerProfile?.pan ?? "",
      dateOfBirth: user?.borrowerProfile?.dateOfBirth?.slice(0, 10) ?? "",
      monthlySalary: user?.borrowerProfile?.monthlySalary ?? 25_000,
      employmentMode: user?.borrowerProfile?.employmentMode ?? "SALARIED",
    },
  });

  const loanForm = useForm<LoanApplicationValues>({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: {
      loanAmount: LOAN_LIMITS.MIN_AMOUNT,
      tenureDays: 90,
    },
  });

  const loanAmount = useWatch({ control: loanForm.control, name: "loanAmount" });
  const tenureDays = useWatch({ control: loanForm.control, name: "tenureDays" });
  const interest = calculateSimpleInterest(loanAmount, tenureDays);
  const totalRepayment = calculateTotalRepayment(loanAmount, tenureDays);

  const submitPersonalDetails = async (values: PersonalDetailsValues) => {
    setWorking(true);

    try {
      const borrowerProfile = await loanService.submitPersonalDetails(values);

      if (user) {
        setUser({ ...user, borrowerProfile });
      }

      toast.success("Eligibility details saved");
      setStep(2);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save borrower details");
    } finally {
      setWorking(false);
    }
  };

  const handleFileUpload = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (!UPLOAD_LIMITS.ACCEPTED_TYPES.includes(file.type as (typeof UPLOAD_LIMITS.ACCEPTED_TYPES)[number])) {
      toast.error("Only PDF, JPG and PNG files are allowed");
      return;
    }

    if (file.size > UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES) {
      toast.error("File size must be 5MB or less");
      return;
    }

    setWorking(true);
    setUploadProgress(0);

    try {
      await uploadService.uploadSalarySlip(file, setUploadProgress);
      setUploadedFileName(file.name);
      toast.success("Salary slip uploaded");
      setStep(3);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setWorking(false);
    }
  };

  const applyForLoan = async (values: LoanApplicationValues) => {
    setWorking(true);

    try {
      await loanService.apply(values);
      toast.success("Loan application submitted");
      setStep(4);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to submit loan application");
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loan Application"
        description="Complete eligibility, upload income proof, and configure your loan."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          {step === 1 ? (
            <Card>
              <CardHeader>
                <CardTitle>Personal details and BRE</CardTitle>
                <CardDescription>Eligibility is checked on the server before the workflow can continue.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 md:grid-cols-2" onSubmit={personalForm.handleSubmit(submitPersonalDetails)}>
                  <FormInput
                    label="Full name"
                    error={personalForm.formState.errors.fullName}
                    registration={personalForm.register("fullName")}
                  />
                  <FormInput
                    label="PAN"
                    error={personalForm.formState.errors.pan}
                    registration={personalForm.register("pan")}
                  />
                  <FormInput
                    label="Date of birth"
                    type="date"
                    error={personalForm.formState.errors.dateOfBirth}
                    registration={personalForm.register("dateOfBirth")}
                  />
                  <FormInput
                    label="Monthly salary"
                    type="number"
                    error={personalForm.formState.errors.monthlySalary}
                    registration={personalForm.register("monthlySalary", { valueAsNumber: true })}
                  />
                  <Controller
                    control={personalForm.control}
                    name="employmentMode"
                    render={({ field, fieldState }) => (
                      <FormSelect
                        label="Employment mode"
                        options={employmentOptions}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                  <div className="flex items-end">
                    <Button type="submit" className="w-full" disabled={working}>
                      {working ? "Checking..." : "Save and continue"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : null}

          {step === 2 ? (
            <Card>
              <CardHeader>
                <CardTitle>Upload salary slip</CardTitle>
                <CardDescription>PDF, JPG or PNG only. Maximum file size is 5MB.</CardDescription>
              </CardHeader>
              <CardContent>
                <label
                  className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40 p-6 text-center transition-colors hover:bg-muted"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    void handleFileUpload(event.dataTransfer.files[0]);
                  }}
                >
                  <UploadCloud className="mb-3 h-9 w-9 text-primary" />
                  <span className="text-sm font-semibold">Drop salary slip here or browse</span>
                  <span className="mt-1 text-xs text-muted-foreground">Accepted formats: PDF, JPG, PNG</span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    disabled={working}
                    onChange={(event) => void handleFileUpload(event.target.files?.[0])}
                  />
                </label>
                {uploadProgress > 0 ? (
                  <div className="mt-4 space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-xs text-muted-foreground">{uploadProgress}% uploaded</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {step === 3 ? (
            <Card>
              <CardHeader>
                <CardTitle>Loan configuration</CardTitle>
                <CardDescription>Interest is fixed at 12% per annum using simple interest.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-8" onSubmit={loanForm.handleSubmit(applyForLoan)}>
                  <Controller
                    control={loanForm.control}
                    name="loanAmount"
                    render={({ field }) => (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Loan amount</span>
                          <MoneyValue value={field.value} className="font-semibold" />
                        </div>
                        <Slider
                          min={LOAN_LIMITS.MIN_AMOUNT}
                          max={LOAN_LIMITS.MAX_AMOUNT}
                          step={10_000}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </div>
                    )}
                  />
                  <Controller
                    control={loanForm.control}
                    name="tenureDays"
                    render={({ field }) => (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">Tenure</span>
                          <span className="font-semibold">{field.value} days</span>
                        </div>
                        <Slider
                          min={LOAN_LIMITS.MIN_TENURE_DAYS}
                          max={LOAN_LIMITS.MAX_TENURE_DAYS}
                          step={5}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </div>
                    )}
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <MetricCard label="Principal" value={<MoneyValue value={loanAmount} />} />
                    <MetricCard label="Interest" value={<MoneyValue value={interest} />} hint="12% p.a." />
                    <MetricCard label="Repayment" value={<MoneyValue value={totalRepayment} />} />
                  </div>
                  <Button type="submit" disabled={working}>
                    {working ? "Submitting..." : "Submit application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : null}

          {step === 4 ? (
            <Card>
              <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
                <CheckCircle2 className="mb-4 h-12 w-12 text-primary" />
                <h2 className="text-xl font-semibold">Application submitted</h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Your loan is now in APPLIED status and will be reviewed by the sanction team.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {["Eligibility", "Salary slip", "Loan terms", "Submitted"].map((label, index) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold">
                  {step > index + 1 ? <CheckCircle2 className="h-4 w-4 text-primary" /> : index + 1}
                </div>
                <span className={step === index + 1 ? "font-semibold" : "text-muted-foreground"}>{label}</span>
              </div>
            ))}
            {uploadedFileName ? (
              <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-xs">
                <FileUp className="h-4 w-4 text-primary" />
                <span className="truncate">{uploadedFileName}</span>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

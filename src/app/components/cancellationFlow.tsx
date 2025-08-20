"use client";
import { useState } from "react";
import Image from "next/image";

export default function CancellationFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [flowPath, setFlowPath] = useState<"yes" | "no" | null>(null);
  const [declinedOffer, setDeclinedOffer] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [cancelReasonDetail, setCancelReasonDetail] = useState("");

  const updateAnswer = (q: string, val: string) =>
    setAnswers((prev) => ({ ...prev, [q]: val }));

  // Validation for job feedback section
  const allAnsweredYesFlow =
    answers["foundWithMM"] &&
    answers["appliedRoles"] &&
    answers["emailedCompanies"] &&
    answers["interviewCompanies"];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col overflow-hidden">
        {/* HEADER (inline layout) */}
        {step !== 4 && step !== 5 && step !== 6 && step !== 7 && (
          <div className="px-6 py-4 border-b flex items-center justify-between">
            {/* Back button */}
            {step > 1 ? (
              <button
                onClick={() => {
                  if (step === 2 && flowPath === "no" && declinedOffer) {
                    setDeclinedOffer(false);
                  } else {
                    setStep(step - 1);
                  }
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            {/* Title */}
            <h3 className="text-sm font-medium text-gray-700">
              Subscription Cancellation
            </h3>

            {/* Progress + step */}
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-2 w-6 rounded-md transition-all duration-300 ${
                      step >= i ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                Step {Math.min(step, 3)} of 3
              </span>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* BODY */}
        <div className="flex flex-col md:flex-row">
          {/* STEP 1: Initial question */}
          {step === 1 && (
            <div className="flex-1 p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Hey mate, Quick one before you go.
                <br />
                <span className="italic">Have you found a job yet?</span>
              </h2>
              <p className="text-sm text-gray-600">
                Whatever your answer, we just want to help you take the next
                step. With visa support, or by hearing how we can do better.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setFlowPath("yes");
                    setStep(2);
                  }}
                  className="w-full px-4 py-3 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Yes, I’ve found a job
                </button>
                <button
                  onClick={() => {
                    setFlowPath("no");
                    setStep(2);
                  }}
                  className="w-full px-4 py-3 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Not yet – I’m still looking
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Discount offer (no path) */}
          {step === 2 && flowPath === "no" && !declinedOffer && (
            <div className="flex-1 p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                We built this to help you land the job, this makes it a little
                easier.
              </h2>
              <p className="text-sm text-gray-600">
                We’ve been there and we’re here to help you.
              </p>
              <div className="border rounded-xl p-4 bg-purple-50">
                <p className="text-sm font-medium text-gray-900">
                  Here’s <span className="text-purple-600">50% off</span> until
                  you find a job.
                </p>
                <p className="text-lg font-bold text-purple-700">$12.50/month</p>
                <p className="text-xs text-gray-500 line-through">$25/month</p>
                <button
                  onClick={() => setStep(4)}
                  className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                >
                  Get 50% off
                </button>
              </div>
              <button
                onClick={() => setDeclinedOffer(true)}
                className="w-full px-4 py-2 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                No thanks
              </button>
            </div>
          )}

          {/* STEP 2: Feedback questions (yes path) */}
          {step === 2 && flowPath === "yes" && (
            <div className="flex-1 p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Congrats on the new role! 🎉
              </h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-700">
                  Did you find this job with MigrateMate?
                </p>
                <div className="flex gap-3">
                  {["Yes", "No"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateAnswer("foundWithMM", opt)}
                      className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${
                        answers["foundWithMM"] === opt
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-700">
                  How many roles did you apply for through MigrateMate?
                </p>
                <div className="flex gap-3 flex-wrap">
                  {["0", "1-5", "6-20", "20+"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateAnswer("appliedRoles", opt)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        answers["appliedRoles"] === opt
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-700">
                  How many companies did you email directly?
                </p>
                <div className="flex gap-3 flex-wrap">
                  {["0", "1-5", "6-20", "20+"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateAnswer("emailedCompanies", opt)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        answers["emailedCompanies"] === opt
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-700">
                  How many companies did you interview with?
                </p>
                <div className="flex gap-3 flex-wrap">
                  {["0", "1-2", "3-5", "5+"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateAnswer("interviewCompanies", opt)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        answers["interviewCompanies"] === opt
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <button
                disabled={!allAnsweredYesFlow}
                onClick={() => {
                  if (answers.foundWithMM === "Yes") {
                    setStep(3); // visa card for foundWithMM = Yes
                  } else {
                    setStep(6); // visa card for foundWithMM = No
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium ${
                  allAnsweredYesFlow
                    ? "bg-[#8952fc] text-white hover:bg-[#7b40fc]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2b: Feedback (no path, declined offer) */}
          {step === 2 && flowPath === "no" && declinedOffer && (
            <div className="flex-1 p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Help us improve
              </h2>
              <p className="text-sm text-gray-600">
                Before you go, could you tell us a bit more?
              </p>

              <div className="space-y-3">
                {[
                  "Too expensive",
                  "Platform not helpful",
                  "Not many relevant jobs",
                  "Decided not to move",
                  "Other",
                ].map((opt) => (
                  <div key={opt} className="space-y-2">
                    <button
                      onClick={() => setCancelReason(opt)}
                      className={`w-full text-left px-4 py-3 border rounded-lg text-sm font-medium ${
                        cancelReason === opt
                          ? "bg-purple-50 border-purple-400 text-purple-700"
                          : "text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {opt}
                    </button>
                    {cancelReason === opt && (
                      <textarea
                        value={cancelReasonDetail}
                        onChange={(e) => setCancelReasonDetail(e.target.value)}
                        placeholder="Please tell us more..."
                        className="w-full border rounded-lg p-3 text-sm text-gray-800"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  Keep subscription
                </button>
                <button
                  disabled={!cancelReason}
                  onClick={() => setStep(5)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    cancelReason
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Confirm cancellation
                </button>
              </div>
            </div>
          )}

          {/* STEP 3a: Visa card if found with MM */}
          {step === 3 && flowPath === "yes" && answers["foundWithMM"] === "Yes" && (
            <div className="flex-1 p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                We have helped you land the job 🎉
              </h2>
              <p className="text-sm text-gray-600">Now let us help you with the visa.</p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(7)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Yes, help me
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  No thanks
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Visa card if job found elsewhere */}
          {step === 6 && flowPath === "yes" && answers["foundWithMM"] === "No" && (
            <div className="flex-1 p-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                You landed the job! 🎉 That’s what we live for.
              </h2>
              <p className="text-sm text-gray-600">
                Even if it wasn’t through Migrate Mate, can we help you with the visa?
              </p>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(7)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                >
                  Yes, help me
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  No thanks
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success screen after discount */}
          {step === 4 && (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-10 flex flex-col justify-center items-start space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">Great choice, mate!</h2>
                <p className="text-sm text-gray-600">
                  You are still on track to land a role. Let’s make it happen together.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-3 bg-[#8952fc] text-white rounded-lg text-sm font-medium hover:bg-[#7b40fc]"
                >
                  Land your dream job
                </button>
              </div>
              <div className="md:w-1/3 relative p-4">
                <Image
                  src="/images/empire-state.jpg"
                  alt="City view"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover rounded-xl shadow-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 5: Normal cancellation */}
          {step === 5 && (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-10 flex flex-col justify-center items-start space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">Subscription cancelled</h2>
                <p className="text-sm text-gray-600">
                  Your subscription has been cancelled, mate. Thanks for trying Migrate Mate — you’re welcome back anytime!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-3 bg-[#8952fc] text-white rounded-lg text-sm font-medium hover:bg-[#7b40fc]"
                >
                  Close
                </button>
              </div>
              <div className="md:w-1/3 relative p-4">
                <Image
                  src="/images/empire-state.jpg"
                  alt="Cancellation confirmed"
                  width={400}
                  height={400}
                  className="h-full w-full object-cover rounded-xl shadow-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 7: Visa support confirmed */}
                    {step === 7 && (
            <div className="flex flex-col md:flex-row">
              <div className="flex-1 p-10 space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  Your cancellation’s all sorted, mate, no more charges.
                </h2>

                <div className="border rounded-xl p-5 bg-gray-50 flex gap-4 items-start shadow-sm">
                  <Image
                    src="/images/mihailo-profile.jpeg"
                    alt="Mihailo Bozic"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">Mihailo Bozic</p>
                    <p className="text-xs text-gray-500">
                      mihailo@migratemate.co
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      I’ll be reaching out soon to help with the visa side of things.
                      We’ve got your back, whether it’s questions, paperwork, or just figuring out your options.
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      Keep an eye on your inbox, I’ll be in touch{" "}
                      <span className="underline cursor-pointer">shortly</span>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="mt-6 px-6 py-3 bg-[#8952fc] text-white rounded-lg text-sm font-medium hover:bg-[#7b40fc]"
                >
                  Finish
                </button>
              </div>
            </div> 
          )}
          {/* Right side illustration (steps 1–3 only) */}
          {step !== 4 && step !== 5 && step !== 6 && step !== 7 && (
            <div className="md:w-1/3 relative p-4">
              <Image
                src="/images/empire-state.jpg"
                alt="Illustration"
                width={400}
                height={400}
                className="h-full w-full object-cover rounded-xl shadow-sm"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

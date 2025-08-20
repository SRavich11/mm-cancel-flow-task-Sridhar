'use client';

import { useState } from 'react';
import Image from 'next/image';

interface CancellationFlowProps {
  onClose: () => void;
}

type FlowPath = 'yes' | 'no' | null;

export default function CancellationFlow({ onClose }: CancellationFlowProps) {
  const [step, setStep] = useState(1);
  const [flowPath, setFlowPath] = useState<FlowPath>(null);
  const [declinedOffer, setDeclinedOffer] = useState(false);

  // Questionnaire answers
  const [answers, setAnswers] = useState<Record<string, string | null>>({
    foundWithMM: null,
    rolesApplied: null,
    companiesEmailed: null,
    companiesInterviewed: null,
  });

  const [cancelReason, setCancelReason] = useState<string | null>(null);
  const [cancelReasonDetail, setCancelReasonDetail] = useState<string>('');

  const updateAnswer = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const allAnsweredYesFlow = Object.values(answers).every((v) => v !== null);

  const stepLabel =
    step === 1 ? 'Step 1' : step === 2 ? 'Step 2' : step === 3 ? 'Step 3' : 'Completed';

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Hide header for success + final screens */}
      {step !== 4 && step !== 5 && step !== 6 && step !== 7 && (
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={() => {
                  if (step === 2 && flowPath === 'no' && declinedOffer) {
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

            <h3 className="text-sm font-medium text-gray-700">
              Subscription Cancellation
            </h3>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {/* Segmented progress bar */}
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex flex-1 space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-md transition-all duration-300 ${
                    step >= i ? 'bg-[#8952fc] shadow-sm' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
              {stepLabel}
            </span>
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col md:flex-row">
        {/* Step 1 */}
        {step === 1 && (
          <div className="flex-1 p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 leading-snug">
              Hey mate,
              <br />
              Quick one before you go.
              <br />
              <span className="italic font-semibold">
                Have you found a job yet?
              </span>
            </h2>
            <p className="text-sm text-gray-600">
              Whatever your answer, we just want to help you take the next step.
              With visa support, or by hearing how we can do better.
            </p>
            <div className="space-y-3 pt-4">
              <button
                onClick={() => {
                  setFlowPath('yes');
                  setStep(2);
                }}
                className="w-full px-4 py-3 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Yes, I’ve found a job
              </button>
              <button
                onClick={() => {
                  setFlowPath('no');
                  setStep(2);
                }}
                className="w-full px-4 py-3 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Not yet – I’m still looking
              </button>
            </div>
          </div>
        )}

        {/* Step 2a: Offer (No path) */}
        {step === 2 && flowPath === 'no' && !declinedOffer && (
          <div className="flex-1 p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              We built this to help you land the job, this makes it a little easier.
            </h2>
            <p className="text-sm text-gray-600">
              We’ve been there and we’re here to help you.
            </p>
            <div className="border border-purple-300 rounded-lg p-4 bg-purple-50 space-y-2">
              <p className="text-sm text-gray-700">
                Here’s <span className="font-semibold">50% off</span> until you find a job.
              </p>
              <p className="text-base font-bold text-purple-700">
                $12.50
                <span className="text-sm text-gray-500">/month</span>{' '}
                <span className="line-through text-gray-400">$25/month</span>
              </p>
              <button
                onClick={() => setStep(4)} // success screen
                className="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Get 50% off
              </button>
            </div>
            <button
              onClick={() => setDeclinedOffer(true)} // stay in step 2, go to feedback
              className="w-full px-4 py-3 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              No thanks
            </button>
          </div>
        )}

        {/* Step 2a: Questionnaire after declining offer */}
        {step === 2 && flowPath === 'no' && declinedOffer && (
          <div className="flex-1 p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              We’d love to know why you’re leaving
            </h2>

            {/* Roles applied */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                How many roles did you apply for through Migrate Mate?*
              </p>
              <div className="flex gap-2 flex-wrap">
                {['0', '1–5', '6–20', '20+'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer('rolesApplied', opt)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                      answers.rolesApplied === opt
                        ? 'bg-purple-50 border-purple-400 text-purple-700'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Companies emailed */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                How many companies did you email directly?*
              </p>
              <div className="flex gap-2 flex-wrap">
                {['0', '1–5', '6–20', '20+'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer('companiesEmailed', opt)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                      answers.companiesEmailed === opt
                        ? 'bg-purple-50 border-purple-400 text-purple-700'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Companies interviewed */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                How many different companies did you interview with?*
              </p>
              <div className="flex gap-2 flex-wrap">
                {['0', '1–2', '3–5', '5+'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => updateAnswer('companiesInterviewed', opt)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                      answers.companiesInterviewed === opt
                        ? 'bg-purple-50 border-purple-400 text-purple-700'
                        : 'text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom actions */}
            <div className="flex flex-col gap-3 pt-6">
              <button
                onClick={() => setStep(4)} // back to discount success
                className="w-full px-4 py-3 border rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
              >
                Get 50% off
              </button>
              <button
                disabled={
                  !answers.rolesApplied ||
                  !answers.companiesEmailed ||
                  !answers.companiesInterviewed
                }
                onClick={() => setStep(3)}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium ${
                  answers.rolesApplied &&
                  answers.companiesEmailed &&
                  answers.companiesInterviewed
                    ? 'bg-[#8952fc] text-white hover:bg-[#7b40fc]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2b: Questionnaire (Yes path) */}
        {step === 2 && flowPath === 'yes' && (
          <div className="flex-1 p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Congrats on the new role! 🎉
            </h2>
            <div className="space-y-6 pt-2">
              {/* Question 1 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Did you find this job with MigrateMate?*
                </p>
                <div className="flex gap-2">
                  {['Yes', 'No'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateAnswer('foundWithMM', opt)}
                      className={`flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${
                        answers.foundWithMM === opt
                          ? 'bg-purple-50 border-purple-400 text-purple-700'
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  How many roles did you apply for through Migrate Mate?*
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['0', '1–5', '6–20', '20+'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateAnswer('rolesApplied', opt)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        answers.rolesApplied === opt
                          ? 'bg-purple-50 border-purple-400 text-purple-700'
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  How many companies did you email directly?*
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['0', '1–5', '6–20', '20+'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => updateAnswer('companiesEmailed', opt)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        answers.companiesEmailed === opt
                          ? 'bg-purple-50 border-purple-400 text-purple-700'
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4 */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  How many different companies did you interview with?*
                </p>
                <div className="flex gap-2 flex-wrap">
                  {['0', '1–2', '3–5', '5+'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        updateAnswer('companiesInterviewed', opt)
                      }
                      className={`px-4 py-2 border rounded-lg text-sm font-medium ${
                        answers.companiesInterviewed === opt
                          ? 'bg-purple-50 border-purple-400 text-purple-700'
                          : 'text-gray-800 hover:bg-gray-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              disabled={!allAnsweredYesFlow}
              onClick={() => {
                if (answers.foundWithMM === 'Yes') {
                  setStep(3);
                } else {
                  setStep(6);
                }
              }}
              className={`w-full px-4 py-3 rounded-lg text-sm font-medium ${
                allAnsweredYesFlow
                  ? 'bg-[#8952fc] text-white hover:bg-[#7b40fc]'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 3a: Final cancellation reason (No path, declined offer) */}
        {step === 3 && flowPath === 'no' && declinedOffer && (
          <div className="flex-1 p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              What's the main reason for cancelling?
            </h2>

            <div className="space-y-3">
              {[
                'Too expensive',
                'Platform not helpful',
                'Not many relevant jobs',
                'Decided not to move',
                'Other',
              ].map((opt) => (
                <div key={opt} className="space-y-2">
                  <button
                    onClick={() => setCancelReason(opt)}
                    className={`w-full text-left px-4 py-3 border rounded-lg text-sm font-medium ${
                      cancelReason === opt
                        ? 'bg-purple-50 border-purple-400 text-purple-700'
                        : 'text-gray-800 hover:bg-gray-50'
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
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm cancellation
              </button>
            </div>
          </div>
        )}

        {/* Step 3b: Visa card (Job found with MM) */}
        {step === 3 && flowPath === 'yes' && answers.foundWithMM === 'Yes' && (
          <div className="flex-1 p-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              We have helped you land the job 🎉
            </h2>
            <p className="text-sm text-gray-600">
              Now let us help you with the visa.
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

        {/* Step 6: Visa card (Job found elsewhere) */}
        {step === 6 && flowPath === 'yes' && answers.foundWithMM === 'No' && (
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

        {/* Step 4: Success screen after discount */}
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

        {/* Step 5: Cancellation confirmed (normal) */}
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

        {/* Step 7: Visa support confirmed cancellation */}
        {step === 7 && (
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 p-10 flex flex-col justify-center items-start space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">Subscription cancelled ✅</h2>
              <p className="text-sm text-gray-600">
                We’ll help you with your visa — check your inbox for the next steps.
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
                alt="Visa confirmed"
                width={400}
                height={400}
                className="h-full w-full object-cover rounded-xl shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Side illustration for steps 1–3 */}
        {step !== 4 && step !== 5 && step !== 7 && (
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
  );
}

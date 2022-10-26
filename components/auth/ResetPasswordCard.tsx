import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import FormSubmitButton from "../common/buttons/FormSubmitButton";

export default function ResetPasswordCard() {
  const [email, setEmail] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email)
      .then(() =>
        alert("Password resent email sent. This may be in your SPAM folder")
      )
      .catch(() => alert("Error sending password reset email"));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-12 w-auto"
          src="/assets/logo.svg"
          alt="Workflow"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Password reset
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <FormSubmitButton
                value={"Send password reset email"}
                class={"w-full"}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

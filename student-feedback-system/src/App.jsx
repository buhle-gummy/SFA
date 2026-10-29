import { useState } from "react";
import "./App.css";

function App() {
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [courseName, setCourseName] = useState("");
  const [rating, setRating] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setMessage("");
    setMessageType("");

    if (
      !studentName.trim() ||
      !email.trim() ||
      !courseName ||
      !rating ||
      !feedback.trim()
    ) {
      setMessage("Please complete all fields before submitting.");
      setMessageType("error");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setMessage("Please enter a valid email address.");
      setMessageType("error");
      return;
    }

    if (feedback.trim().length < 5) {
      setMessage("Feedback must contain at least 5 characters.");
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://mhlanga.app.n8n.cloud/webhook-test/student-feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentName: studentName.trim(),
            email: email.trim(),
            courseName,
            rating: Number(rating),
            feedback: feedback.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setMessage("Thank you! Your feedback was submitted successfully.");
      setMessageType("success");

      setStudentName("");
      setEmail("");
      setCourseName("");
      setRating("");
      setFeedback("");
    } catch (error) {
      console.error("Feedback submission error:", error);

      setMessage(
        "Sorry, we couldn't submit your feedback. Please try again."
      );
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="feedback-container">
      <div className="feedback-card">
        <h1>Student Feedback Form</h1>

        <p className="subtitle">
          We value your feedback. Tell us about your learning experience.
        </p>

        {message && (
          <div
            className={`message ${messageType}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentName">Student Name</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              placeholder="Enter your full name"
              value={studentName}
              onChange={(event) => setStudentName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="courseName">Course Name</label>
            <select
              id="courseName"
              name="courseName"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              required
            >
              <option value="">Select your course</option>
              <option value="Full Stack Web Development">
                Full Stack Web Development
              </option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Data Science">Data Science</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
              required
            >
              <option value="">Select a rating</option>
              <option value="1">1 - Very Poor</option>
              <option value="2">2 - Poor</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="feedback">Feedback Message</label>
            <textarea
              id="feedback"
              name="feedback"
              placeholder="Tell us about your learning experience..."
              value={feedback}
              onChange={(event) => setFeedback(event.target.value)}
              rows={5}
              minLength={5}
              required
            />
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default App;

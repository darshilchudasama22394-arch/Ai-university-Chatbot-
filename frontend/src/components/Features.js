import React from "react";

function Features() {
  const features = [
    {
      icon: "🤖",
      title: "AI Chatbot",
      description: "Get answers grounded only in the four academic booklets."
    },
    {
      icon: "💬",
      title: "Booklet Guidance",
      description: "Ask about the supported academic programmes and semesters."
    },
    {
      icon: "🔒",
      title: "Secure Login",
      description: "Protected student and admin accounts."
    },
    {
      icon: "📢",
      title: "University Notices",
      description: "Stay updated with the latest announcements."
    }
  ];

  return (
    <section id="features" className="container py-5">
      <h2 className="text-center fw-bold mb-5">
        Why Choose Our Helpdesk?
      </h2>

      <div className="row g-4">
        {features.map((feature, index) => (
          <div className="col-md-6 col-lg-3" key={index}>
            <div className="card h-100 text-center p-4">
              <div style={{ fontSize: "44px", lineHeight: "1.1" }}>{feature.icon}</div>

              <h4 className="mt-3">{feature.title}</h4>

              <p className="text-muted">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
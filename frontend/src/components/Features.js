function Features() {
  const features = [
    {
      icon: "🤖",
      title: "AI Chatbot",
      description: "Get instant answers to university-related questions."
    },
    {
      icon: "💬",
      title: "24/7 Support",
      description: "Ask questions anytime from anywhere."
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
      <h2 className="text-center text-white fw-bold mb-5">
        Why Choose Our Helpdesk?
      </h2>

      <div className="row">
        {features.map((feature, index) => (
          <div className="col-md-6 col-lg-3 mb-4" key={index}>
            <div className="card h-100 shadow border-0 rounded-4 text-center p-4">
              <div style={{ fontSize: "50px" }}>{feature.icon}</div>

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
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { contactDetails, contactOffices, contactReasons, getOfficePhoneHref } from "./contactData";
import { useScrollToSection } from "../../utils/pageScroll";
import "./Contact.scss";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef(null);

  useScrollToSection(heroRef, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact">
      <section className="contact__hero" ref={heroRef}>
        <div className="contact__hero-inner">
          <p className="contact__eyebrow">Contact Us</p>
          <h1>Let&apos;s Build Your AI Future Together</h1>
          <p>
            Reach out to discuss enterprise AI capabilities, industry solutions,
            partnerships, or transformation services with the AI Verse team.
          </p>
        </div>
      </section>

      <section className="contact__main">
        <div className="contact__container">
          <div className="contact__grid">
            <div className="contact__info">
              <h2>Get in Touch</h2>
              <p>
                Our experts help enterprises evaluate, pilot, and scale AI with
                measurable business outcomes. We typically respond within one business day.
              </p>

              <ul className="contact__details">
                <li>
                  <strong>Email</strong>
                  <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
                </li>
                <li>
                  <strong>India</strong>
                  <a href={getOfficePhoneHref(contactDetails.indiaPhone)}>
                    {contactDetails.indiaPhone}
                  </a>
                </li>
                <li>
                  <strong>United States</strong>
                  <a href={getOfficePhoneHref(contactDetails.usPhone)}>
                    {contactDetails.usPhone}
                  </a>
                </li>
                <li>
                  <strong>Ready to start?</strong>
                  <Link to="/get-started">Submit an AI solution request</Link>
                </li>
              </ul>
            </div>

            <form className="contact__form" onSubmit={handleSubmit}>
              <h2>Send a Message</h2>

              {submitted ? (
                <p className="contact__success">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
              ) : (
                <>
                  <label>
                    Full Name
                    <input type="text" name="name" required placeholder="Your name" />
                  </label>

                  <label>
                    Work Email
                    <input type="email" name="email" required placeholder="you@company.com" />
                  </label>

                  <label>
                    Company
                    <input type="text" name="company" placeholder="Your organization" />
                  </label>

                  <label>
                    Reason for Contact
                    <select name="reason" defaultValue="">
                      <option value="" disabled>
                        Select a topic
                      </option>
                      {contactReasons.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Message
                    <textarea
                      name="message"
                      rows={5}
                      required
                      placeholder="Tell us about your AI goals or questions"
                    />
                  </label>

                  <button type="submit" className="contact__submit">
                    Send Message
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      <section className="contact__locations" aria-labelledby="contact-locations-title">
        <div className="contact__container">
          <h2 id="contact-locations-title">Our Global Locations</h2>
          <p className="contact__locations-intro">
            Reach the Espire Infolabs team at any of our global offices.
          </p>
          <div className="contact__offices">
            {contactOffices.map((office) => (
              <article key={office.id}>
                <h3>{office.region}</h3>
                <p className="contact__office-company">{office.company}</p>
                <div className="contact__office-address">
                  {office.addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                {(office.phones?.length > 0 || office.email) && (
                  <div className="contact__office-contact">
                    {office.phones?.map((phone) => (
                      <a key={phone} href={getOfficePhoneHref(phone)}>
                        {phone}
                      </a>
                    ))}
                    {office.email && (
                      <a href={`mailto:${office.email}`}>{office.email}</a>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

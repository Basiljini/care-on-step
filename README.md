# care-on-step
Role-based Clinical Management Platform built with Next.js, Node.js, and Supabase featuring secure patient records, audit logging, row-level security, and structured clinical assessments.

# Clinical Management Platform

A secure **role-based clinical management platform** built using **Next.js, Node.js, and Supabase** for managing patient records, clinical assessments, treatments, and staff activities.

The system focuses on **data security, structured medical workflows, and full audit visibility**, ensuring that healthcare staff can manage patient information safely and efficiently.

---

# 🚀 Features

### Role-Based Access Control

* Secure authentication and authorization
* User roles such as **Admin, Staff, and Clinician**
* Access restrictions enforced using **Row-Level Security (RLS)**

### Patient Management

* Create and manage patient profiles
* Structured patient assessments
* Treatment history tracking
* Advanced search for patient records

### Clinical Assessments

* Dynamic assessment forms
* Large clinical data stored efficiently using **JSON fields**
* Structured medical observations and treatment notes

### Audit Logging

* Complete activity tracking for staff actions
* Stores **who changed what and when**
* Shows **previous vs updated data**
* Timeline-style history view for each patient

### Data Security

* Supabase **Row-Level Security policies**
* Controlled access to sensitive patient records
* Secure database schema with relational structure

### Performance Optimization

* Efficient queries and structured schema design
* Server-side data handling
* Scalable architecture suitable for healthcare systems

---

# 🏗 Tech Stack

**Frontend**

* Next.js
* React
* Tailwind CSS

**Backend**

* Node.js
* Supabase Edge Functions

**Database**

* PostgreSQL (Supabase)

**Security**

* Row-Level Security (RLS)
* Role-based access control

---

# 🗂 Database Design

The system uses a **relational schema** with structured tables for core data and JSON fields for flexible medical assessments.

Key entities include:

* Users
* Patients
* Assessments
* Treatments
* Audit Logs

Large checkbox-based clinical inputs are stored as **JSON objects** to allow flexible schema evolution without frequent migrations.

---

# 🔍 Audit System

Every modification to patient records generates an audit entry that records:

* Staff member responsible for the change
* Timestamp of modification
* Previous values
* Updated values
* Type of action performed

This provides **full traceability for medical data changes**, which is critical in clinical systems.

```

# 📊 Future Improvements

* Automated clinical reporting
* AI-assisted clinical documentation
* Advanced analytics dashboards
* Multi-clinic support
* HIPAA/GDPR compliance enhancements

---

# 📄 License

This project is for **educational and portfolio purposes**.

---

# 👨‍💻 Author

**Basil Jini Varghese**

Software Engineer | Full Stack Developer | Cloud Enthusiast

LinkedIn: https://www.linkedin.com/in/basil-jini/
GitHub: https://github.com/Basiljini

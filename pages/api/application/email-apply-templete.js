import React from 'react';

const NewApplicantNotification = ({
  employerName,
  jobTitle,
  employerCompanyName,
  applicantName,
  applicantRemarks,
  linkToApplication,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.logo}>
        <img
          src="https://gikijo.com/img/gikijo_logo.png"
          alt="Gikijo"
          style={styles.logoImage}
        />
      </div>
      <h4 style={styles.header}>New Applicant Notification</h4>
      <p style={styles.paragraph} class="mt-3">
        Hi {employerName},
      </p>
      <p style={styles.paragraph}>
        A new candidate, <strong>{applicantName}</strong>, has applied for the{' '}
        <strong>{jobTitle}</strong> position at{' '}
        <strong>{employerCompanyName}</strong>.
      </p>
      {applicantRemarks ? (
        <>
          <p style={styles.paragraph}>Applicant's Remarks:</p>
          <p style={styles.paragraph}>"{applicantRemarks}"</p>
        </>
      ) : (
        ''
      )}
      <p style={styles.paragraph}>
        To review the application, please log into your account on Gikijo.
      </p>
      <p>
        <a style={styles.button} href={linkToApplication}>
          Login Here
        </a>
      </p>
      <p style={styles.paragraph}>
        Thank you,
        <br />
        The Gikijo Team
      </p>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
  },
  logo: {
    marginBottom: '20px',
  },
  logoImage: {
    maxWidth: '100px',
    height: 'auto',
  },
  header: {
    color: '#2c3e50',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  paragraph: {
    color: '#666666',
    fontSize: '1rem',
    marginBottom: '20px',
  },
  button: {
    display: 'inline-block',
    padding: '10px 20px',
    color: '#ffffff',
    backgroundColor: '#0d6efd',
    textDecoration: 'none',
    borderRadius: '4px',
  },
};

export default NewApplicantNotification;

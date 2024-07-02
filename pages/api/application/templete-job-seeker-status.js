import React from 'react';

const NewStatusJobSeeker = ({
  jobTitle,
  employerCompanyName,
  applicantName,
  applicationStatus,
  employerRemarks,
  linkToWebsite,
}) => {
  return (
    <div style={styles.container}>
      <div style={styles.logo}>
        <img
          src="https://www.gikijo.com/images/gikijo-logo.png"
          alt="Gikijo"
          style={styles.logoImage}
        />
      </div>
      <h4 style={styles.header}>Application Status Update</h4>
      <p style={styles.paragraph} class="mt-3">
        Hi {applicantName},
      </p>
      <p style={styles.paragraph}>
        We are pleased to inform you that there has been an update regarding
        your application for the <strong>{jobTitle}</strong> position at{' '}
        <strong>{employerCompanyName}</strong>.
      </p>
      <p style={styles.paragraph}>
        <strong>New Status:</strong> {applicationStatus}
      </p>
      {employerRemarks ? (
        <>
          <p style={styles.paragraph}>
            <strong>Employer's Remarks:</strong> "{employerRemarks}"
          </p>
        </>
      ) : (
        ''
      )}
      <p style={styles.paragraph}>
        For more details and the next steps, please log in to your account.
      </p>
      <p>
        <a style={styles.button} href={linkToWebsite}>
          Login Here
        </a>
      </p>
      <p style={styles.paragraph}>
        Thank you for choosing our platform for your job search. We wish you
        success in your application process.
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

export default NewStatusJobSeeker;

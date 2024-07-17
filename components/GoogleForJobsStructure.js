import Script from 'next/script';
import moment from 'moment';
import { COUNTRIES, EMPLOYMENT_TYPES, SALARY_TYPES } from '../utils/constants';

const GoogleForJobsStructure = ({ job }) => {
  const jobData = {
    title: job?.title,
    description: `
    <div>
      <label>Benefits</label>
      <ul>
        ${job?.benefits
          .map((ben, index) => `<li key=${index}>${ben}</li>`)
          .join('')}
      </ul>
      <label>Requirements</label>
      <ul>
        ${job?.requirements
          .map((req, index) => `<li key=${index}>${req}</li>`)
          .join('')}
      </ul>
      <label>Additional Info</label>
      ${
        job?.additional_info
          ? `<ul><li><div>${job.additional_info}</div></li></ul>`
          : '-'
      }
    </div>
  `,
    datePosted: moment(job?.created_at).format('YYYY-MM-DD'),
    validThrough: moment(job?.created_at).add(1, 'months').format('YYYY-MM-DD'),
    employmentType: EMPLOYMENT_TYPES.find(
      (type) => type.value === job?.employment_type
    )?.googleForJob,
    company: {
      name: job?.company_profile?.company_name || '',
      website: job?.company_profile?.website || '',
    },
    location: {
      streetAddress: job?.company_profile?.address_1,
      city: job?.company_profile?.city,
      region: job?.company_profile?.state,
      postalCode: job?.company_profile?.postcode,
      country: COUNTRIES.find(
        (type) => type.value === job?.company_profile?.country
      )?.googleForJob,
    },
    salary: {
      currency: 'MYR',
      minValue: job?.min_salary,
      maxValue: job?.max_salary,
      unitText: SALARY_TYPES.find((type) => type.value === job?.salary_type)
        ?.googleForJob,
    },
  };

  const checkIfJobValid = () => {
    if (
      job &&
      jobData?.description &&
      jobData?.location?.region &&
      jobData?.location?.country &&
      jobData.salary.minValue &&
      jobData.salary.maxValue
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      {checkIfJobValid() ? (
        <>
          <Script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org/',
                '@type': 'JobPosting',
                title: jobData.title,
                description: jobData.description,
                datePosted: jobData.datePosted,
                validThrough: jobData.validThrough,
                employmentType: jobData.employmentType,
                hiringOrganization: {
                  '@type': 'Organization',
                  name: jobData.company.name,
                  sameAs: jobData.company.website,
                },
                jobLocation: {
                  '@type': 'Place',
                  address: {
                    '@type': 'PostalAddress',
                    addressRegion: jobData.location.region,
                    addressCountry: jobData.location.country,
                  },
                },
                baseSalary: {
                  '@type': 'MonetaryAmount',
                  currency: jobData.salary.currency,
                  value: {
                    '@type': 'QuantitativeValue',
                    minValue: jobData.salary.minValue,
                    maxValue: jobData.salary.maxValue,
                    unitText: jobData.salary.unitText,
                  },
                },
              }),
            }}
          />
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default GoogleForJobsStructure;

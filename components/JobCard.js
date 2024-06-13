import { useApiCall } from '../context/apiCall';
import { useTempData } from '../context/tempData';
import { COUNTRIES, EMPLOYMENT_TYPES, SALARY_TYPES } from '../utils/constants';
import toast from 'react-hot-toast';
import moment from 'moment';

const JobCard = ({ selected = null, item, displayOnly = false }) => {
  const { publishJobPostApi } = useApiCall();
  const { tempData, setValueTempData } = useTempData();

  const statusConfig = {
    publish: {
      status: 'Published',
      theme: {
        badge: 'badge-status-success',
        icon: <i class="bi bi-check-circle me-1"></i>,
      },
      infoBox: {
        theme: 'alert-success',
        content: (
          <span>
            <i class="bi bi-broadcast me-1"></i> Your post is now published on
            Gikijo. To get more views, send it to our suggested channels.
          </span>
        ),
      },
    },
    unpublish: {
      status: 'Unpublish',
      theme: {
        badge: 'badge-status-error',
        icon: <i class="bi bi-exclamation-circle me-1"></i>,
      },
      infoBox: {
        theme: 'alert-error',
        content: (
          <span>
            <i class="bi bi-exclamation-circle me-1"></i> Your post is now ready
            to be published on Gikijo. Publish it today and send it on our
            suggested channels.{' '}
            <strong
              class="clickable text-primary"
              onClick={async () => {
                const resultPublish = await publishJobPostApi({
                  job_post_id: item.id,
                  is_published: true,
                });

                if (resultPublish?.data?.is_published == true) {
                  toast.success('Published!', {
                    duration: 5000,
                  });

                  setValueTempData('selectedItem', {
                    ...tempData.selectedItem,
                    editJobDetails: item,
                    publishModalConfigType: 'share',
                  });
                }
              }}
            >
              Click here to publish.
            </strong>
          </span>
        ),
      },
    },
  };

  const jobData = {
    status:
      item?.job_post_validity?.is_published == true ? 'publish' : 'unpublish',
    title: item.title,
    employmentType: EMPLOYMENT_TYPES.find(
      (type) => type.value === item?.employment_type
    )?.name,
    createdAt: moment(item?.created_at).fromNow(),
    salary: `RM ${item?.min_salary} -  ${item?.max_salary} ${
      SALARY_TYPES.find((type) => type.value === item?.salary_type)?.name
    }`,
    companyName: item.company_profile?.company_name,
    location: `${
      item.company_profile?.state ? `${item.company_profile.state}, ` : ''
    }${
      COUNTRIES.find((type) => type.value === item.company_profile?.country)
        ?.name
    }`,
    requirements: item?.requirements ? item?.requirements : [],
    benefits: item?.benefits ? item?.benefits : [],
  };

  return (
    <>
      <div
        class={`card card-size ${
          displayOnly ? 'text-muted card-no-border' : 'card-move hover-border'
        } ${selected ? 'selected-border' : ''}`}
      >
        <div class="card-body">
          <div class="row">
            <div class="col-8">
              <h6 class="mb-0">{jobData.title}</h6>
            </div>
            {displayOnly ? (
              <div class="col-auto ms-auto">
                <span
                  class={`badge rounded-pill ${
                    statusConfig[jobData.status]?.theme.badge
                  }`}
                >
                  {statusConfig[jobData.status]?.theme.icon}{' '}
                  {statusConfig[jobData.status]?.status}
                </span>
              </div>
            ) : (
              ''
            )}
          </div>
          <div>
            <small class="text-muted">{jobData.employmentType}</small>
            <i class="bi bi-dot"></i>
            <small class="text-muted">{jobData.createdAt}</small>
          </div>
          <ul class="list-unstyled mt-3">
            <li>
              <i class="bi bi-building"></i> {jobData.companyName}
            </li>
            <li>
              <i class="bi bi-cash"></i> {jobData.salary}
            </li>
            <li class="mb-2">
              <i class="bi bi-geo-alt"></i> {jobData.location}
            </li>
            {jobData.benefits.slice(0, 3).map((item, index) => {
              return (
                <li key={index} class="text-truncate">
                  <span style={{ marginRight: '0.5rem' }}>&#8226;</span> {item}
                </li>
              );
            })}
          </ul>
        </div>
        {displayOnly ? <span class="transparent-gradient"></span> : ''}
      </div>
      {displayOnly ? (
        <div
          class={`alert ${statusConfig[jobData.status]?.infoBox.theme} small`}
          role="alert"
        >
          {statusConfig[jobData.status]?.infoBox.content}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default JobCard;

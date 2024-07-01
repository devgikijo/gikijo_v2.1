import { useApiCall } from '../context/apiCall';
import { useTempData } from '../context/tempData';
import { COUNTRIES, EMPLOYMENT_TYPES, SALARY_TYPES } from '../utils/constants';
import toast from 'react-hot-toast';
import moment from 'moment';
import { jobCardContent } from '../utils/helper';

const JobCard = ({ item, displayOnly = false, showSettingsInfo = false }) => {
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
            <i class="bi bi-broadcast me-1"></i> Your post is now live on
            Gikijo. To reach more people, share it through the suggested
            channels below.
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

  return (
    <>
      <div
        class={`card card-size ${
          displayOnly ? 'text-muted card-no-border' : ''
        } 
       ${
         tempData.selectedItem?.jobDetails?.id === item.id
           ? ''
           : displayOnly
           ? ''
           : 'card-move hover-border'
       }`}
      >
        <div class="card-body">
          <div class="row">
            <div class="col-lg">
              <h6 class="mb-0">{jobCardContent(item).title}</h6>
              <div class="col-auto">
                <small class="text-muted">
                  {jobCardContent(item).employmentType}
                </small>
                <i class="bi bi-dot"></i>
                <small class="text-muted">
                  {jobCardContent(item).createdAt}
                </small>
              </div>
            </div>
            {displayOnly && showSettingsInfo ? (
              <div class="col-auto ms-auto">
                <span
                  class={`badge rounded-pill ${
                    statusConfig[jobCardContent(item).status]?.theme.badge
                  }`}
                >
                  {statusConfig[jobCardContent(item).status]?.theme.icon}{' '}
                  {statusConfig[jobCardContent(item).status]?.status}
                </span>
              </div>
            ) : (
              <>
                {displayOnly ? (
                  ''
                ) : (
                  <>
                    {tempData.selectedItem?.jobDetails?.id === item.id ? (
                      <div class="col-auto ms-auto">
                        <i class="bi bi-caret-right-fill text-primary"></i>
                      </div>
                    ) : (
                      ''
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <ul class="list-unstyled mt-3">
            <li>
              <i class="bi bi-building"></i> {jobCardContent(item).companyName}
            </li>
            <li>
              <i class="bi bi-cash"></i> {jobCardContent(item).salary}
            </li>
            {jobCardContent(item).location ? (
              <li class="mb-2">
                <i class="bi bi-geo-alt"></i> {jobCardContent(item).location}
              </li>
            ) : (
              ''
            )}
            {jobCardContent(item)
              .benefits.slice(0, 3)
              .map((item, index) => {
                return (
                  <li key={index} class="text-truncate">
                    <span style={{ marginRight: '0.5rem' }}>&#8226;</span>
                    {item}
                  </li>
                );
              })}
          </ul>
        </div>
        {displayOnly ? <span class="transparent-gradient"></span> : ''}
      </div>
      {displayOnly && showSettingsInfo ? (
        <div
          class={`alert ${
            statusConfig[jobCardContent(item).status]?.infoBox.theme
          } small`}
          role="alert"
        >
          {statusConfig[jobCardContent(item).status]?.infoBox.content}
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default JobCard;

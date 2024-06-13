import { useRouter } from 'next/router';
import { COMPANY_SIZES, COUNTRIES, PAGES } from '../utils/constants';

const CompanyCard = ({ selected, item }) => {
  const router = useRouter();

  const companyData = {
    title: item.company_name,
    about_us: item.about_us,
    companySize: COMPANY_SIZES.find((type) => type.value === item?.size)?.name,
    location: `${item?.state ? `${item.state}, ` : ''}${
      COUNTRIES.find((type) => type.value === item?.country)?.name
    }`,
    postCount: item.job_post?.length || 0,
  };

  return (
    <div
      class={`card card-move card-size hover-border ${
        selected ? 'selected-border' : ''
      }`}
      onClick={() => {
        if (item?.uid) {
          router.push(
            `${PAGES.profile.directory}?type=company&uid=${item?.uid}`
          );
        }
      }}
    >
      <div class="card-body col d-flex flex-column">
        <div>
          <div class="row-md d-flex align-items-center">
            <i class="bi bi-building me-2"></i>
            <h6 class="card-title mb-0 text-truncate">{companyData.title}</h6>
          </div>
          <small class="text-muted">{companyData.companySize}</small>
          <i class="bi bi-dot"></i>
          <small class="text-muted">{companyData.location}</small>
        </div>
        <div class="col-lg flex-grow-1">
          <p class="truncate-paragraph mt-3">{companyData.about_us}</p>
        </div>
        <div>
          <small class="text-primary text-end">
            <strong class="h2 pe-1">{companyData.postCount}</strong>
            {' job openings '}
            <i class="bi bi-arrow-right-short"></i>
          </small>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

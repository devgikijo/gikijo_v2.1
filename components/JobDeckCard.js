import Link from 'next/link';
import LoadingSpinner from './LoadingSpinner';
import EmptyMessage from './EmptyMessage';
import JobCard from './JobCard';
import { PAGES } from '../utils/constants';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { useApiCall } from '../context/apiCall';
import AnimatedComponent from './AnimatedComponent';

function JobDeckCard() {
  const { apiData } = useApiCall();
  const { isModalOpen, toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const isLoading = apiData.topJobPost?.isLoading;
  const isEmpty =
    !apiData.topJobPost?.isLoading && apiData.topJobPost.data.length == 0;
  const item = apiData.topJobPost?.data ?? [];

  return (
    <>
      <div class="mb-3">
        <LoadingSpinner isLoading={isLoading} />
        {isEmpty && <EmptyMessage />}
        {!isEmpty && (
          <div class="row row-cols-1 row-cols-md-3 g-4">
            {item.map((item, index) => (
              <AnimatedComponent
                key={index}
                stageIndex={index}
                animateByIndex={true}
              >
                <div class="col">
                  <div
                    onClick={() => {
                      toggleModal('jobDetails');
                      setValueTempData('selectedItem', {
                        ...tempData.selectedItem,
                        jobDetails: item,
                      });
                    }}
                  >
                    <JobCard item={item} />
                  </div>
                </div>
              </AnimatedComponent>
            ))}
          </div>
        )}
      </div>
      <Link href={`${PAGES.jobs.directory}`} class="nav-link">
        <h6 class="text-primary text-end" data-lang-key="global.see_more">
          See More <i class="bi bi-arrow-right-short"></i>
        </h6>
      </Link>
    </>
  );
}

export default JobDeckCard;

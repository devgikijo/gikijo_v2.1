import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyMessage from './EmptyMessage';
import JobCard from './JobCard';
import JobAlertCard from './JobAlertCard';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import { useApiCall } from '../context/apiCall';
import AnimatedComponent from './AnimatedComponent';
import GlobalButton from './GlobalButton';

const JobList = ({ showModalOnClick = true }) => {
  const { apiData, getAllJobPostApi } = useApiCall();
  const { toggleModal } = useModal();
  const { tempData, setValueTempData } = useTempData();
  const [firstRun, setFirstRun] = useState(true);
  const [page, setPage] = useState(0);
  const [jobListData, setJobListData] = useState([]);

  const isLoading = apiData.allJobPost.isLoading;
  const isEmpty = !isLoading && jobListData.length === 0;
  const ITEM_PER_PAGE = 5;

  const fetchData = async ({ resetPage = false }) => {
    const from = resetPage ? 0 : page * ITEM_PER_PAGE;
    const to = from + ITEM_PER_PAGE;
    const result = await getAllJobPostApi({
      jobFilter: tempData.jobFilter,
      from,
      to,
    });

    setJobListData((prev) => (resetPage ? result : [...prev, ...result]));
    setPage((prev) => (resetPage ? 1 : prev + 1));
  };

  useEffect(() => {
    if (firstRun) {
      fetchData({ resetPage: false });
      setFirstRun(false);
    } else {
      const delayDebounceFn = setTimeout(() => {
        fetchData({ resetPage: true });
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [tempData.jobFilter]);

  const handleJobCardClick = (item) => {
    if (showModalOnClick) {
      toggleModal('jobDetails');
    }
    setValueTempData('selectedItem', {
      ...tempData.selectedItem,
      jobDetails: item,
    });
  };

  const handleLoadMoreClick = () => {
    fetchData({ resetPage: false });
  };

  return (
    <div className="mb-3">
      {!isEmpty && (
        <div className="col">
          {jobListData.map((item, index) => (
            <AnimatedComponent
              key={index}
              stageIndex={index}
              animateByIndex={true}
            >
              <div className="col mb-3">
                <div onClick={() => handleJobCardClick(item)}>
                  <JobCard item={item} />
                </div>
                {index === 2 && (
                  <div className="mt-3">
                    <JobAlertCard />
                  </div>
                )}
              </div>
            </AnimatedComponent>
          ))}
          {jobListData.length > 0 && (
            <GlobalButton
              btnType="button"
              btnClass="btn btn-outline-primary w-100"
              btnLoading={isLoading}
              btnOnClick={handleLoadMoreClick}
            >
              <i class="bi bi-arrow-down-short"></i> See More
            </GlobalButton>
          )}
        </div>
      )}
      {isLoading && <LoadingSpinner isLoading={isLoading} />}
      {isEmpty && <EmptyMessage />}
    </div>
  );
};

export default JobList;

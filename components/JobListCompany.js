import EmptyMessage from './EmptyMessage';
import JobCard from './JobCard';
import { useModal } from '../context/modal';
import { useTempData } from '../context/tempData';
import AnimatedComponent from './AnimatedComponent';

const JobListCompany = ({ showModalOnClick = true, jobListData = [] }) => {
  const { tempData, setValueTempData } = useTempData();
  const { toggleModal } = useModal();
  const isEmpty = jobListData.length === 0;

  const handleJobCardClick = (item) => {
    if (showModalOnClick) {
      toggleModal('jobDetails');
    }
    setValueTempData('selectedItem', {
      ...tempData.selectedItem,
      jobDetails: item,
    });
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
              </div>
            </AnimatedComponent>
          ))}
        </div>
      )}

      {isEmpty && <EmptyMessage />}
    </div>
  );
};

export default JobListCompany;

import { useRouter } from 'next/router';
import { useTempData } from '../context/tempData';
import { EMPLOYMENT_TYPES, PAGES } from '../utils/constants';

function JobTypeBadge() {
  const { tempData, setValueTempData } = useTempData();
  const router = useRouter();

  return (
    <>
      <div class="my-5 text-center">
        <div class="row g-2">
          {EMPLOYMENT_TYPES.map((item, index) => (
            <div
              class="col"
              key={index}
              onClick={() => {
                setValueTempData('jobFilter', {
                  ...tempData.jobFilter,
                  type: item.value,
                });
                router.push(PAGES.jobs.directory);
              }}
            >
              <span class="btn btn-outline-primary badge badge-status-primary">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default JobTypeBadge;

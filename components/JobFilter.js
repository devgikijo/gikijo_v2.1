import { useState, useEffect } from 'react';
import {
  EMPLOYMENT_TYPES,
  MAX_SALARY,
  MIN_SALARY,
  PAGES,
} from '../utils/constants';
import GlobalButton from './GlobalButton';
import { useApiCall } from '../context/apiCall';
import { useRouter } from 'next/router';
import { useTempData } from '../context/tempData';

function JobFilter({
  showTitle = true,
  showFilter = true,
  navigateToJobs = false,
}) {
  const { tempData, setValueTempData, clearAllFilter } = useTempData();

  const router = useRouter();
  const [buttonConfig, setButtonConfig] = useState({
    search: {
      isLoading: false,
    },
  });

  const onSubmitSearch = async (event) => {
    event.preventDefault();

    if (navigateToJobs) {
      router.push(PAGES.jobs.directory);
    }

    setButtonConfig({
      ...buttonConfig,
      search: {
        ...buttonConfig.search,
        isLoading: true,
      },
    });

    setButtonConfig({
      ...buttonConfig,
      search: {
        ...buttonConfig.search,
        isLoading: false,
      },
    });
  };

  const checkFilterNotEmpty = () => {
    const anyValueNotEmpty = Object.values(tempData.jobFilter).some(
      (value) => value !== '' && value !== null && value !== undefined
    );

    return anyValueNotEmpty;
  };

  return (
    <>
      <div class="card bg-primary mb-2 border-0 ">
        <div class="card-body text-white">
          {showTitle ? (
            <>
              <h4 class="card-title" data-lang-key="index.fresh_job_xxx">
                Find your dream job here
              </h4>
              <h6
                class="card-subtitle fw-lighter mb-3"
                data-lang-key="index.explore_job_xxx"
              >
                Explore job opportunities and apply with ease.
              </h6>
            </>
          ) : (
            <></>
          )}
          <form onSubmit={onSubmitSearch} class="row">
            <div class="col">
              <input
                type="text"
                className="form-control form-control-lg"
                id="input-search-job"
                placeholder="Job title, company, or keywords"
                value={tempData.jobFilter.keyword}
                onChange={(event) =>
                  setValueTempData('jobFilter', {
                    ...tempData.jobFilter,
                    keyword: event.target.value,
                  })
                }
              />
            </div>
            <div class="col-auto">
              <GlobalButton
                btnType="submit"
                btnClass="btn btn-light btn-lg"
                btnTitle="Search"
                btnLoading={buttonConfig.search.isLoading}
              />
            </div>
          </form>
        </div>
      </div>
      {showFilter ? (
        <div class="mb-5">
          <div class="dropdown">
            <a
              class="btn btn-secondary dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Job Type:{' '}
              <b>
                {
                  EMPLOYMENT_TYPES.find(
                    (type) => type.value === tempData?.jobFilter?.type
                  )?.name
                }
              </b>
            </a>
            <ul class="dropdown-menu">
              {EMPLOYMENT_TYPES.map((item, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => {
                      setValueTempData('jobFilter', {
                        ...tempData.jobFilter,
                        type: item.value,
                      });
                    }}
                  >
                    <a
                      class={`dropdown-item ${
                        item.value == tempData.jobType ? 'active' : ''
                      } key={index}`}
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>{' '}
            <a
              class="btn btn-secondary dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Min Salary:{' '}
              <b>
                {
                  MIN_SALARY.find(
                    (type) => type.value === tempData?.jobFilter?.minSalary
                  )?.name
                }
              </b>
            </a>
            <ul class="dropdown-menu">
              {MIN_SALARY.map((item, index) => {
                return (
                  <li
                    onClick={() => {
                      setValueTempData('jobFilter', {
                        ...tempData.jobFilter,
                        minSalary: item.value,
                      });
                    }}
                  >
                    <a
                      class={`dropdown-item ${
                        item.value == tempData?.jobFilter?.minSalary
                          ? 'active'
                          : ''
                      } key={index}`}
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>{' '}
            <a
              class="btn btn-secondary dropdown-toggle"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Max Salary:{' '}
              <b>
                {
                  MAX_SALARY.find(
                    (type) => type.value === tempData?.jobFilter?.maxSalary
                  )?.name
                }
              </b>
            </a>
            <ul class="dropdown-menu">
              {MAX_SALARY.map((item, index) => {
                return (
                  <li
                    onClick={() => {
                      setValueTempData('jobFilter', {
                        ...tempData.jobFilter,
                        maxSalary: item.value,
                      });
                    }}
                  >
                    <a
                      class={`dropdown-item ${
                        item.value == tempData?.jobFilter?.maxSalary
                          ? 'active'
                          : ''
                      } key={index}`}
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>{' '}
          </div>

          {checkFilterNotEmpty() ? (
            <h6
              class="mt-3 text-primary clickable"
              onClick={() => {
                clearAllFilter();
              }}
            >
              <i class="bi bi-x-circle"></i> Clear all filters
            </h6>
          ) : (
            ''
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default JobFilter;

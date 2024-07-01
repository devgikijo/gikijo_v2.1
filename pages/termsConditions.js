import { PAGES } from '../utils/constants';
import Breadcrumb from '../components/BreadCrumb';
import { TERMS_CONDITIONS } from '../utils/textContent';

const main = () => {
  return (
    <div className="body">
      <section class="container">
        <Breadcrumb page={PAGES.terms_conditions} />

        <div class="sticky-top py-3">
          <div class="dropdown d-block d-md-none pl-2 ">
            <div class="d-grid gap-2">
              <button
                class="btn btn-primary dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Contents
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                {TERMS_CONDITIONS.map((item) => {
                  return (
                    <li>
                      <a class="dropdown-item" href={`#${item.id}`}>
                        {item.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div class="bd-body">
          {/* <aside class="bd-aside sticky-xl-top text-muted align-self-start mb-3 mb-xl-5 px-2">
            <h2 class="h6 pt-4 pb-3 mb-4 border-bottom">On this page</h2>
            <nav class="small">
              <ul class="list-unstyled">
                <li class="my-2">
                  <button
                    class="btn d-inline-flex align-items-center collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    data-bs-target="#contents-collapse"
                    aria-controls="contents-collapse"
                  >
                    Contents
                  </button>
                  <ul
                    class="list-unstyled ps-3 collapse"
                    id="contents-collapse"
                  >
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#typography"
                      >
                        Typography
                      </a>
                    </li>
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#images"
                      >
                        Images
                      </a>
                    </li>
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#tables"
                      >
                        Tables
                      </a>
                    </li>
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#figures"
                      >
                        Figures
                      </a>
                    </li>
                  </ul>
                </li>
                <li class="my-2">
                  <button
                    class="btn d-inline-flex align-items-center collapsed"
                    data-bs-toggle="collapse"
                    aria-expanded="false"
                    data-bs-target="#forms-collapse"
                    aria-controls="forms-collapse"
                  >
                    Forms
                  </button>
                  <ul class="list-unstyled ps-3 collapse" id="forms-collapse">
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#overview"
                      >
                        Overview
                      </a>
                    </li>
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#disabled-forms"
                      >
                        Disabled forms
                      </a>
                    </li>
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#sizing"
                      >
                        Sizing
                      </a>
                    </li>
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#input-group"
                      >
                        Input group
                      </a>
                    </li>
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#floating-labels"
                      >
                        Floating labels
                      </a>
                    </li>
                    <li>
                      <a
                        class="d-inline-flex align-items-center rounded"
                        href="#validation"
                      >
                        Validation
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </aside> */}
          <div class="bd-cheatsheet">
            <section>
              <h3 class="sticky-xl-top pt-xl-5 pb-2 pb-xl-3 d-none d-md-block">
                Contents
              </h3>
              {TERMS_CONDITIONS.map((item) => {
                return (
                  <article class="my-3" id={item.id}>
                    <div class="bd-heading sticky-xl-top align-self-start mt-5 mb-3 mt-xl-0 mb-xl-2 d-none d-md-block">
                      <h5>{item.title}</h5>
                    </div>
                    <div>
                      <h5 class="d-block d-md-none">{item.title}</h5>
                      {item.content}
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default main;

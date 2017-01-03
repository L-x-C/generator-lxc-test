import React from 'react';
import {Route} from 'react-router';

import App from './containers/App';
import PreciseMatchField from './containers/preciseMatch/PreciseMatchField';
import PreciseMatchJob from './containers/preciseMatch/PreciseMatchJob';
import PreciseMatchCareer from './containers/preciseMatch/PreciseMatchCareer';
import JobCategory from './containers/preciseMatch/JobCategory';
import JobCategoryRelation from './containers/preciseMatch/JobCategoryRelation';
import Major from './containers/preciseMatch/Major';
import Enumeration from './containers/preciseMatch/Enumeration';
import NotFoundPage from './components/notFoundPage/NotFoundPage';
import HelloPage from './components/notFoundPage/Hello';

export default function getRoutes() {
  return (
    <Route component={App}>
      <Route path="/" component={HelloPage}/>

      <Route path="pmatch/field" component={PreciseMatchField}/>
      <Route path="pmatch/job" component={PreciseMatchJob}/>
      <Route path="pmatch/career" component={PreciseMatchCareer}/>
      <Route path="pmatch/enumeration" component={Enumeration}/>
      <Route path="pmatch/category" component={JobCategory}/>
      <Route path="pmatch/category_relation" component={JobCategoryRelation}/>
      <Route path="pmatch/major" component={Major}/>

      <Route path="404" component={NotFoundPage}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  );
}

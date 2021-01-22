import _ from 'lodash';
import { connect } from 'react-redux';
import Settings from './Settings';
import {
  setAnalytics,
  setRegion,
  setSSMPrefix,
} from '../../store/config/actions';

const mapStateToProps = (state) =>
  _.pick(state.config, ['analytics', 'region', 'ssmPrefix']);
const mapDispatchToProps = { setAnalytics, setRegion, setSSMPrefix };
export default connect(mapStateToProps, mapDispatchToProps)(Settings);

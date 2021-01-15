import _ from 'lodash';
import { connect } from 'react-redux';
import Hosts from './Hosts';
import { setRegion } from '../../store/config/actions';

const mapStateToProps = (state) =>
  _.pick(state.config, ['region', 'ssmPrefix']);
const mapDispatchToProps = { setRegion };
export default connect(mapStateToProps, mapDispatchToProps)(Hosts);

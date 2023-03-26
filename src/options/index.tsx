import { render } from 'preact'
import { Options } from './Options'
import '../assets/bootstrap-theme.min.css';
import '../assets/bootstrap.min.css';
import './index.css'
import './Options.css';

render(<Options />, document.getElementById('app') as HTMLElement)

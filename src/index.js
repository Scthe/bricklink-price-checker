import { h, render } from 'preact';
import ContentScript from './content';

console.log("=== extension reload ===");

render(<ContentScript/>, document.body);

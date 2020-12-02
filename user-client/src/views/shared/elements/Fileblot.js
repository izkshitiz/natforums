import { Quill } from 'react-quill';

const BlockEmbed = Quill.import('blots/block/embed');

class FileBlot extends BlockEmbed {

  static create(value) {
    let link = document.createElement('a');
    link.setAttribute('href', value.href);
    link.setAttribute("target", "_blank");
    let textnode = document.createTextNode(value.name);
    link.appendChild(textnode);
    const node = super.create();
    node.appendChild(link);
    return node;
  }

  static value() { }

}

FileBlot.blotName = 'file';
FileBlot.tagName = 'p';
FileBlot.className = 'thread-file-links';

export default FileBlot;
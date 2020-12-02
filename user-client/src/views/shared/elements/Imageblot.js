import { Quill } from 'react-quill';

const BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {

    static create(value) {
        const node = super.create();
        node.setAttribute('src', value.src);
        node.setAttribute('alt', value.alt);
        return node;
    }

    static value(node) {
        return { src: node.getAttribute('src'), alt: node.getAttribute('alt') };
    }

}

ImageBlot.blotName = 'image';
ImageBlot.tagName = 'img';
ImageBlot.className = 'thread-images';

export default ImageBlot;
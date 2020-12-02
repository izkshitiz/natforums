import { Quill } from 'react-quill';

const BlockEmbed = Quill.import('blots/block/embed');

class VideoBlot extends BlockEmbed {

    static create(value) {
        if (value && value.src) {
            const node = super.create();
            node.setAttribute('src', value.src);
            node.setAttribute('title', value.title);
            node.setAttribute('width', '100%');
            node.setAttribute('controls', '');
            return node;
        } else {
            const node = document.createElement('iframe');
            node.setAttribute('src', value);
            node.setAttribute('frameborder', '0');
            node.setAttribute('allowfullscreen', true);
            node.setAttribute('width', '100%');
            return node;
        }
    }

    static value(node) {
        return { src: node.getAttribute('src'), alt: node.getAttribute('title') };
    }

}

VideoBlot.blotName = 'video';
VideoBlot.tagName = 'video';
VideoBlot.calssName = 'thread-videos';

export default VideoBlot;
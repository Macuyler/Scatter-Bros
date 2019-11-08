import React, { useState } from 'react';
import Draggable from 'react-draggable';

const Editor = () => {
    const [pipes, setPipes] = useState([
        { id: 1, pipeType: 1, rot: 1 },
        { id: 2, pipeType: 2, rot: 0 },
        { id: 3, pipeType: 3, rot: 0 },
        { id: 4, pipeType: 5, rot: 0 },
        { id: 5, pipeType: 7, rot: 0 },
        { id: 6, pipeType: 90, rot: 1 },
    ]);
    const [selected, setSelected] = useState({ id: 1, pipeType: 1, rot: 1 });

    const getIndex = (s) => pipes.indexOf(pipes.find(e => e.id === s.id));

    const rotate = () => {
        if (selected) {
            const s = getIndex(selected);
            selected.rot += 1;
            selected.rot %= 4;
            pipes[s] = selected;
            setPipes([...pipes]);
        }
    };

    return (
        <div className="page-wrapper" style={{
            backgroundColor: '#2e2e2e'
        }}>
            <button onClick={rotate}>Rotate</button>
            {pipes.map(p => (
                <Draggable
                    key={p.id}
                    defaultPosition={{ x: 0, y: 30 }}
                    grid={[30, 30]}
                    scale={1}
                    onStart={() => setSelected(p)}
                >
                    <div className={`pipe${p.pipeType}${p.rot ? ` rot${p.rot}` : ''}`}>
                        <span></span>
                    </div>
                </Draggable>
            ))}
        </div>
    );
};

export default Editor;
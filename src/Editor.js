import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { connectors } from './globals.js';

const Editor = () => {
    const [pipes, setPipes] = useState([
        { id: 2, pipeType: 2, rot: 0 },
        { id: 3, pipeType: 3, rot: 0 },
        { id: 4, pipeType: 5, rot: 0 },
        { id: 5, pipeType: 7, rot: 0 },
        { id: 6, pipeType: 90, rot: 0 },
        { id: 7, pipeType: 't', rot: 0 },
        { id: 8, pipeType: 'cap', rot: 0 },
        { id: 9, pipeType: 'con', rot: 0 },
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
            backgroundColor: '#2e2e2e',
            overflow: 'hidden'
        }}>
            <button onClick={rotate}>Rotate</button>
            {pipes.map(p => (
                <Draggable
                    key={p.id}
                    defaultPosition={{ x: 0, y: 104 * p.id }}
                    grid={[52, 52]}
                    scale={1}
                    onStart={() => setSelected(p)}
                    onStop={e => console.log(e)}
                >
                    <div className={`pipe${p.pipeType}${p.rot ? ` rot${p.rot}` : ''}`} style={{ zIndex: connectors.includes(p.pipeType) ? 5 : 3 }}>
                        {p.pipeType === 90 ? (
                            <>
                                <span />
                                <span />
                                <span />
                                <span />
                            </>
                        ) : null }
                        {p.pipeType === 't' ? <span /> : null }
                    </div>
                </Draggable>
            ))}
        </div>
    );
};

export default Editor;
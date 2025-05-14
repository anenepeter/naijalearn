'use client';

import { useState, useEffect, useRef } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanityClient'; // Assuming you have this utility

interface MatchingPair {
  _key: string;
  itemA_text?: string;
  itemA_image?: any; // Sanity image asset type
  itemB_text?: string;
  itemB_image?: any; // Sanity image asset type
}

interface CulturalMatchingGameProps {
  activity: {
    title: string;
    instruction?: string;
    pairs: MatchingPair[];
  };
}

interface DraggableItem {
  id: string;
  type: 'itemA' | 'itemB';
  pairKey: string;
  content: string | any; // text or image asset
}

interface DroppableTarget {
  id: string;
  type: 'itemA' | 'itemB';
  pairKey: string;
}

export function CulturalMatchingGame({ activity }: CulturalMatchingGameProps) {
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [targets, setTargets] = useState<DroppableTarget[]>([]);
  const [matches, setMatches] = useState<Record<string, string>>({}); // { draggableId: droppableId }
  const [incorrectMatches, setIncorrectMatches] = useState<string[]>([]); // Store draggableIds of incorrect matches
  const [isDragging, setIsDragging] = useState(false);
  const [activeItem, setActiveItem] = useState<DraggableItem | null>(null);

  // Initialize items and targets from activity data and shuffle them
  // This effect runs whenever activity.pairs changes
  useEffect(() => {
    const initialItems: DraggableItem[] = [];
    const initialTargets: DroppableTarget[] = [];

    activity.pairs.forEach((pair) => {
      if (pair.itemA_text || pair.itemA_image) {
        initialItems.push({
          id: `itemA-${pair._key}`,
          type: 'itemA',
          pairKey: pair._key,
          content: pair.itemA_text || pair.itemA_image,
        });
        initialTargets.push({
          id: `targetB-${pair._key}`,
          type: 'itemB',
          pairKey: pair._key,
        });
      }
      if (pair.itemB_text || pair.itemB_image) {
        initialItems.push({
          id: `itemB-${pair._key}`,
          type: 'itemB',
          pairKey: pair._key,
          content: pair.itemB_text || pair.itemB_image,
        });
        initialTargets.push({
          id: `targetA-${pair._key}`,
          type: 'itemA',
          pairKey: pair._key,
        });
      }
    });

    // Shuffle items and targets by creating new array references
    setItems([...initialItems].sort(() => Math.random() - 0.5));
    setTargets([...initialTargets].sort(() => Math.random() - 0.5));
  }, [activity.pairs]); // Dependency array ensures this runs when activity.pairs changes

  // Effect to clear incorrect matches after a delay
  useEffect(() => {
    if (incorrectMatches.length > 0) {
      const timer = setTimeout(() => {
        setIncorrectMatches([]);
      }, 1000); // Clear after 1 second
      return () => clearTimeout(timer);
    }
  }, [incorrectMatches]);

  const handleDragStart = (event: any) => {
    setIsDragging(true);
    const activeDraggableItem = items.find(item => item.id === event.active.id);
    if (activeDraggableItem) {
      setActiveItem(activeDraggableItem);
    }
  };

  const handleDragEnd = (event: any) => {
    setIsDragging(false);
    setActiveItem(null); // Clear active item after drag ends
    const { active, over } = event;

    if (active && over) {
      const draggableId = active.id;
      const droppableId = over.id;

      const draggableItem = items.find((item) => item.id === draggableId);
      const droppableTarget = targets.find((target) => target.id === droppableId);

      if (draggableItem && droppableTarget) {
        // Check if it's a correct match (itemA matches targetB of the same pairKey, or vice versa)
        const isCorrectMatch =
          (draggableItem.type === 'itemA' && droppableTarget.type === 'itemB' && draggableItem.pairKey === droppableTarget.pairKey) ||
          (draggableItem.type === 'itemB' && droppableTarget.type === 'itemA' && draggableItem.pairKey === droppableTarget.pairKey);

        if (isCorrectMatch) {
          setMatches((prev) => ({ ...prev, [draggableId]: droppableId }));
          // TODO: Add visual feedback for correct match (e.g., play sound)
          console.log('Correct match!');
          // Optionally add scoring logic here
        } else {
          // Handle incorrect match
          setIncorrectMatches(prev => [...prev, draggableId]);
          // TODO: Add visual feedback for incorrect match (e.g., shake, play sound)
          console.log('Incorrect match!');
        }
      }
    }
  };

  const Draggable = ({ id, content }: { id: string; content: string | any }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

    const isMatched = Object.keys(matches).includes(id);

    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={`p-4 border rounded-md cursor-grab ${isMatched ? 'opacity-50 cursor-auto' : ''} ${incorrectMatches.includes(id) ? 'border-red-500' : ''}`}
        whileHover={{ scale: isMatched ? 1 : 1.05 }}
        whileTap={{ scale: isMatched ? 1 : 0.95 }}
        animate={incorrectMatches.includes(id) ? { x: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {typeof content === 'string' ? (
          <p>{content}</p>
        ) : (
          <Image src={urlForImage(content).url()} alt="Matching item" width={100} height={100} />
        )}
      </motion.div>
    );
  };

  const Droppable = ({ id, type, pairKey }: DroppableTarget) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    const matchedDraggableId = Object.keys(matches).find((draggableId) => matches[draggableId] === id);
    const matchedItem = matchedDraggableId ? items.find(item => item.id === matchedDraggableId) : undefined;

    return (
      <div
        ref={setNodeRef}
        className={`p-4 border rounded-md flex items-center justify-center text-center transition-all duration-200 ease-in-out
          ${isOver && !matchedDraggableId ? 'bg-blue-200 border-blue-500' : 'bg-gray-100 border-gray-300'}
          ${matchedDraggableId ? 'border-green-500 bg-green-100' : ''}
          ${incorrectMatches.some(itemId => {
            const item = items.find(i => i.id === itemId);
            return item && ((item.type === 'itemA' && type === 'itemB' && item.pairKey === pairKey) || (item.type === 'itemB' && type === 'itemA' && item.pairKey === pairKey));
          }) ? 'border-red-500' : ''}
        `}
      >
        {matchedItem ? (
           typeof matchedItem.content === 'string' ? (
            <p className="font-semibold">{matchedItem.content}</p>
          ) : (
            <Image src={urlForImage(matchedItem.content).url()} alt="Matched item" width={100} height={100} className="mx-auto" />
          )
        ) : (
          <p className="text-gray-500">Drop here</p>
        )}
      </div>
    );
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{activity.title}</h2>
        {activity.instruction && <p className="mb-6">{activity.instruction}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Items</h3>
            <AnimatePresence>
              {items.filter(item => !Object.keys(matches).includes(item.id)).map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  layout
                >
                  <Draggable id={item.id} content={item.content} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Targets</h3>
            {targets.map((target) => (
              <Droppable key={target.id} id={target.id} type={target.type} pairKey={target.pairKey} />
            ))}
          </div>
        </div>
      </div>
      <DragOverlay>
        {isDragging && activeItem ? (
          <div className="p-4 border rounded-md bg-white shadow-lg">
            {typeof activeItem.content === 'string' ? (
              <p>{activeItem.content}</p>
            ) : (
              <Image src={urlForImage(activeItem.content).url()} alt="Dragging item" width={100} height={100} />
            )}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
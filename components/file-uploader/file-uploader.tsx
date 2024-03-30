import {MimeType} from "@/libs/mime";
import type {
  DragEndEvent,
  DragStartEvent,
  MeasuringConfiguration,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  DndContext,
  DragOverlay,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  useDndContext,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import {CSS, isKeyboardEvent} from "@dnd-kit/utilities";
import {
  Button,
  Card,
  CardBody,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import {useEffect, useState} from "react";
import {useDropzone} from "react-dropzone";
import {Logo} from "../icons";
import {subtitle, title} from "../primitives";
import type {Props as PageProps} from "./preview/Page";
import {Layout, Page, Position} from "./preview/Page";
import {useFileUploaderStore} from "./store";

interface FileUploaderProps {
  primaryColor: string;
  acceptedFileTypes: MimeType[];
}

const FileUploader: React.FC<FileUploaderProps> = ({primaryColor, acceptedFileTypes}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const {files, addFiles, updateFiles, items, setItems, error} = useFileUploaderStore();
  const activeIndex = activeId ? items.indexOf(activeId) : -1;
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates}),
  );
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const {acceptedFiles, fileRejections, isDragActive, getRootProps, getInputProps, open} =
    useDropzone({
      accept: acceptedFileTypes.reduce((acc, fileType) => {
        return {...acc, [fileType]: []};
      }, {}),
      noKeyboard: true,
      noClick: true,
      onDropRejected: (fileRejections) => {
        onOpen();
      },
    });
  const measuring: MeasuringConfiguration = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };
  const dropAnimation: DropAnimation = {
    keyframes({transform}) {
      return [
        {transform: CSS.Transform.toString(transform.initial)},
        {
          transform: CSS.Transform.toString({
            scaleX: 0.98,
            scaleY: 0.98,
            x: transform.final.x - 10,
            y: transform.final.y - 10,
          }),
        },
      ];
    },
    sideEffects: defaultDropAnimationSideEffects({
      className: {},
    }),
  };

  useEffect(() => {
    if (acceptedFiles) {
      addFiles(acceptedFiles);
    }
  }, [acceptedFiles]);

  useEffect(() => {
    if (files.length > 0) {
      setItems(files.map((_, index) => index.toString()));
    }
  }, [files]);

  useEffect(() => {
    setIsOverlayVisible(isDragging);
  }, [isDragging]);

  useEffect(() => {
    setIsOverlayVisible(isDragActive);
  }, [isDragActive]);

  useEffect(() => {
    document.addEventListener("dragover", (e) => {
      setIsDragging(true);
    });
    document.addEventListener("dragend", (e) => {
      setIsDragging(false);
    });
    document.addEventListener("dragleave", (e) => {
      setIsDragging(false);
    });
  }, []);

  function handleDragStart({active}: DragStartEvent) {
    setActiveId(active.id);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  function handleDragEnd({over}: DragEndEvent) {
    if (over) {
      const overIndex = items.indexOf(over.id);

      if (activeIndex !== overIndex) {
        const newIndex = overIndex;

        setItems(arrayMove(items, activeIndex, newIndex));
        updateFiles(arrayMove(files, activeIndex, newIndex));
      }
    }

    setActiveId(null);
  }

  function handleRemove(id: UniqueIdentifier) {
    setItems(items.filter((itemId) => itemId !== id));
    updateFiles(files.filter((_, index) => index !== Number(id)));
  }

  return (
    <>
      <Card
        style={{display: isOverlayVisible ? "block" : "none"}}
        {...getRootProps({
          className: "dropzone fixed inset-0 bg-black bg-opacity-70 z-50",
        })}
      >
        <CardBody
          style={{color: "white"}}
          className="justify-center items-center h-screen "
          onClick={() => setIsOverlayVisible(false)}
        >
          <Logo size={50} />
          drop them all <h1 className={title({color: "green", size: "xs"})}>Sire!</h1>
        </CardBody>
      </Card>

      {files.length > 0 ? (
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          sensors={sensors}
          collisionDetection={closestCenter}
          measuring={measuring}
        >
          <SortableContext items={items}>
            <div className="gap-11 mt-0 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
              {items.map((id, index) => (
                <SortablePage
                  focusRingColor={primaryColor}
                  id={id}
                  index={index + 1}
                  key={id}
                  layout={Layout.Grid}
                  activeIndex={activeIndex}
                  onRemove={() => handleRemove(id)}
                  file={files[index]}
                />
              ))}
              {items.length > 0 ? (
                <div className="m-auto h-44">
                  <Card
                    onPress={open}
                    isPressable
                    radius="lg"
                    className="h-32 w-32 bg-center rounded-full    border-dashed border-4 border-gray-300 hover:border-gray-500"
                  >
                    <input {...getInputProps()} />
                    <CardBody
                      style={{fontSize: "25px"}}
                      className="font-bold text-center justify-center"
                    >
                      +
                    </CardBody>
                  </Card>
                </div>
              ) : null}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId ? (
              <PageOverlay
                focusRingColor={primaryColor}
                // @ts-ignore
                file={files[activeId]}
                id={activeId}
                layout={Layout.Grid}
                items={items}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <Card
          style={{
            backgroundColor: "transparent",
            borderStyle: "dashed",
            border: "2px dashed ".concat(primaryColor),
          }}
        >
          <CardBody className="items-center justify-center">
            <input {...getInputProps()} />

            <Card onPress={open} className="w-72 " isPressable>
              <CardBody className="text-center ">
                <h1 className={subtitle({fullWidth: true, size: "sm"})}>+ Select Files</h1>
              </CardBody>
            </Card>

            <Spacer y={2} />
            <Link underline="none">or</Link>
            <h2
              className={subtitle({
                fullWidth: true,
                class: "text-center",
                size: "xs",
              })}
            >
              drop your files here...
            </h2>
          </CardBody>
        </Card>
      )}

      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Unsupported file type</ModalHeader>
              <ModalBody>
                <p>
                  The file <b style={{color: "red"}}>{fileRejections[0].file.name}</b> is not
                  supported.
                </p>
                <p>Please make sure the file type is one of the following:</p>
                <ul>
                  {acceptedFileTypes.map((fileType) => (
                    <li style={{color: "#18c964"}} key={fileType}>
                      {fileType}
                    </li>
                  ))}
                </ul>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  OK
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

function PageOverlay({
  id,
  items,
  ...props
}: Omit<PageProps, "index"> & {items: UniqueIdentifier[]}) {
  const {activatorEvent, over} = useDndContext();
  const isKeyboardSorting = isKeyboardEvent(activatorEvent);
  const activeIndex = items.indexOf(id);
  const overIndex = over?.id ? items.indexOf(over?.id) : -1;

  return (
    <Page
      id={id}
      {...props}
      clone
      insertPosition={
        isKeyboardSorting && overIndex !== activeIndex
          ? overIndex > activeIndex
            ? Position.After
            : Position.Before
          : undefined
      }
    />
  );
}

function SortablePage({
  id,
  activeIndex,
  focusRingColor,
  ...props
}: PageProps & {activeIndex: number}) {
  const {
    attributes,
    listeners,
    index,
    isDragging,
    isSorting,
    over,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges: always,
  });

  return (
    <Page
      ref={setNodeRef}
      focusRingColor={focusRingColor}
      id={id}
      active={isDragging}
      style={{
        transition,
        transform: isSorting ? undefined : CSS.Translate.toString(transform),
      }}
      insertPosition={
        over?.id === id ? (index > activeIndex ? Position.After : Position.Before) : undefined
      }
      {...props}
      {...attributes}
      {...listeners}
    />
  );
}

function always() {
  return true;
}

export default FileUploader;

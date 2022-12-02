import useDocsRoute from "@hooks/use-docs-route";
import ToolsLayout from "@layouts/tools";
import { MetaProps } from "@lib/tools/meta";
import { fetchDocsManifest, findRouteByPath, Route } from "@lib/tools/page";
import { getSlug } from "@lib/tools/utils";

import {
  Badge,
  Button,
  Card,
  Grid,
  Input,
  Loading,
  Radio,
  Spacer,
  Text,
} from "@nextui-org/react";

import { DownloadFile } from "@utils/download";
import { getImageDimensions } from "@utils/image";
import { getFileSizeFromDataUri } from "@utils/size-calc";
import { toNumber } from "lodash";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import { useFilePicker } from "use-file-picker";
interface Props {
  routes: Route[];
  currentRoute?: Route;
}

const selectBorderColor = "deepskyblue";
const JPG = "jpeg",
  PNG = "png",
  WEBP = "webp";

const ORIGINAL = "Original",
  CUSTOM = "Custom";
const DocsPage: React.FC<Props> = ({ routes, currentRoute }) => {
  const { route, prevRoute, nextRoute } = useDocsRoute(routes, currentRoute);
  const router = useRouter();
  const { tag } = getSlug(router.query);
  const [openFileSelector, { filesContent, plainFiles, clear, loading }] =
    useFilePicker({
      multiple: false,
      readAs: "DataURL", // availible formats: "Text" | "BinaryString" | "ArrayBuffer" | "DataURL"
      // accept: '.ics,.pdf',
      accept: [".svg"],
      limitFilesConfig: { min: 1, max: 1 },
      // minFileSize: 1, // in megabytes
      // maxFileSize: 1,
      // readFilesContent: false, // ignores file content
    });

  const [props, setProps] = useState({
    dimension: ORIGINAL,
    outputFormat: WEBP,
    width: 500,
    height: 500,
    originalWidth: 0,
    originalHeight: 0,
    busy: false,
  });

  const [currentImage, setCurrentImage] = useState("");
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const openImageViewer = useCallback((src) => {
    setCurrentImage(src);
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setCurrentImage("");
    setIsViewerOpen(false);
  };

  const [imagesrc, setImagesrc] = useState<
    string | File | Blob | ProgressEvent<FileReader>
  >("");

  const meta: MetaProps = {
    title: route.title.split(":")[1],
    description: route.description,
  };

  const masterReset = () => {
    setProps({ ...props, outputFormat: WEBP, dimension: ORIGINAL });
    setImagesrc("");
    clear();
  };

  async function convert() {
    setImagesrc("");
    var width = 0,
      height = 0;

    if (props.dimension === ORIGINAL) {
      const dimesions = await getImageDimensions(filesContent[0].content);
      setProps({
        ...props,
        originalWidth: dimesions.w,
        originalHeight: dimesions.h,
      });
      width = dimesions.w;
      height = dimesions.h;
    } else {
      width = props.width;
      height = props.height;
    }

    var s = await loadImageAsPNG(filesContent[0].content, width, height);

    setImagesrc(s.src);
    // DownloadFile(s.src, "converted-image-avtoolz." + props.outputFormat);
    setProps({ ...props, busy: false });
  }

  function loadImageAsPNG(url, height, width) {
    var imageContentType = "image/jpeg";

    if (props.outputFormat == JPG) {
      imageContentType = "image/jpeg";
    } else if (props.outputFormat == PNG) {
      imageContentType = "image/png";
    } else if (props.outputFormat == WEBP) {
      imageContentType = "image/webp";
    }

    return new Promise<HTMLImageElement>((resolve, reject) => {
      let sourceImage = new Image();

      sourceImage.onload = () => {
        let png = new Image();
        let cnv = document.createElement("canvas"); // doesn't actually create an element until it's appended to a parent,
        // so will be discarded once this function has done it's job
        cnv.height = height;
        cnv.width = width;

        let ctx = cnv.getContext("2d");

        ctx.drawImage(sourceImage, 0, 0, height, width);
        png.src = cnv.toDataURL(imageContentType); // defaults to image/png
        resolve(png);
      };
      sourceImage.onerror = reject;

      sourceImage.src = url;
    });
  }
  return (
    <>
      {isViewerOpen && (
        <div style={{ position: "absolute", zIndex: "99999" }}>
          <ImageViewer
            src={[currentImage]}
            currentIndex={0}
            onClose={closeImageViewer}
            disableScroll={false}
            backgroundStyle={{
              backgroundColor: "rgba(0,0,0,0.9)",
            }}
            closeOnClickOutside={true}
          />
        </div>
      )}
      <ToolsLayout
        currentRoute={route}
        meta={meta}
        nextRoute={nextRoute}
        prevRoute={prevRoute}
        routes={routes}
        slug={router.route}
        tag={tag}
      >
        <h2>{meta.title}</h2>
        <Grid.Container gap={1} justify="flex-start">
          {filesContent.map((item, index) => (
            <Grid xs={4} sm={2} key={index}>
              <Card isPressable>
                <Card.Body css={{ p: 0, overflow: "hidden" }}>
                  <Card.Image
                    src={item.content}
                    objectFit="cover"
                    width="100%"
                    height={140}
                    onClick={() => openImageViewer(item.content)}
                  />
                  <Card
                    css={{
                      position: "absolute",
                      backgroundColor: "#00000000",
                      // bgBlur: "#ffffff66",
                      bottom: 1,
                      zIndex: 1,
                      alignItems: "center",
                      borderRadius: 0,
                    }}
                  >
                    <Badge color="success" variant="bordered">
                      {getFileSizeFromDataUri(item.content)}
                    </Badge>
                  </Card>
                </Card.Body>
              </Card>
            </Grid>
          ))}

          {!loading && plainFiles.length === 0 ? (
            <Grid
              css={{
                width: "100%",
                border: "dashed 6px",
                borderColor: selectBorderColor,
                borderRadius: "$2xl",
              }}
            >
              <Card isPressable>
                <Card.Body
                  css={{
                    h: 140,
                    p: 0,
                    verticalAlign: "middle",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                  onClick={() => openFileSelector()}
                >
                  + Select Image
                </Card.Body>
              </Card>
            </Grid>
          ) : (
            <>
              <Grid xs={4} sm={1}>
                <Card css={{ backgroundColor: "transparent" }}>
                  <Card.Body
                    css={{
                      h: 140,
                      p: 0,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Card.Image
                      src="/right-arrow.png"
                      objectFit="contain"
                      width="100%"
                      height={140}
                    />
                  </Card.Body>
                </Card>
              </Grid>

              {imagesrc.toString().length === 0 ? (
                <Grid xs={4} sm={2} key="3">
                  <Card>
                    <Card.Body
                      css={{
                        h: 140,
                        p: 0,
                        verticalAlign: "middle",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      Click convert button to see preview
                    </Card.Body>
                  </Card>
                </Grid>
              ) : (
                <Grid xs={4} sm={2}>
                  <Card isPressable>
                    <Card.Body css={{ p: 0, overflow: "hidden" }}>
                      <Card.Image
                        src={imagesrc.toString()}
                        objectFit="cover"
                        width="100%"
                        height={140}
                        onClick={() => openImageViewer(imagesrc.toString())}
                      />
                      <Card
                        css={{
                          position: "absolute",
                          backgroundColor: "#00000000",
                          bottom: 1,
                          zIndex: 1,
                          alignItems: "center",
                          borderRadius: 0,
                        }}
                      >
                        <Badge color="success" variant="bordered">
                          {getFileSizeFromDataUri(imagesrc.toString())}
                        </Badge>
                      </Card>
                    </Card.Body>
                  </Card>
                </Grid>
              )}
            </>
          )}
        </Grid.Container>
        <Spacer y={1} />
        <Text>Supported formats: svg </Text>
        <Spacer y={0.5} />
        <Text color="#9ba1a6">Select Dimensions</Text>
        <Radio.Group
          size="sm"
          orientation="horizontal"
          value={props.dimension}
          onChange={(value) => setProps({ ...props, dimension: value })}
        >
          <Radio key={ORIGINAL} value={ORIGINAL}>
            {ORIGINAL}
          </Radio>
          <Radio key={CUSTOM} value={CUSTOM}>
            {CUSTOM}
          </Radio>
        </Radio.Group>
        <Spacer y={0.5} />
        {props.dimension === CUSTOM ? (
          <Grid.Container justify="flex-start">
            <Grid sm={0.2}></Grid>
            <Grid>
              <Input
                type={"number"}
                // width="100px"
                labelLeft="Width"
                value={props.originalWidth}
                onChange={(e) =>
                  setProps({ ...props, width: toNumber(e.target.value) })
                }
              />
            </Grid>
            <Spacer x={0.5} />
            <Grid>
              <Input
                type={"number"}
                // width="100px"
                labelLeft="Height"
                value={props.originalHeight}
                onChange={(e) =>
                  setProps({ ...props, height: toNumber(e.target.value) })
                }
              />
            </Grid>
          </Grid.Container>
        ) : null}

        <Radio.Group
          size="sm"
          orientation="horizontal"
          value={props.outputFormat}
          onChange={(value) => setProps({ ...props, outputFormat: value })}
          label="Select Output Format"
        >
          <Radio key={WEBP} value={WEBP}>
            WEBP
          </Radio>
        </Radio.Group>
        <Grid.Container gap={2}>
          <Grid>
            <Button
              onPress={() => convert()}
              color="warning"
              disabled={plainFiles.length < 1}
              auto
              ghost
              style={{ zIndex: 1 }}
            >
              {props.busy ? (
                <Loading type="points" color="currentColor" size="sm" />
              ) : (
                "Convert"
              )}
            </Button>
          </Grid>
          <Grid>
            <Button
              onPress={() =>
                DownloadFile(
                  imagesrc.toString(),
                  "av-compressed" + props.outputFormat
                )
              }
              color="success"
              disabled={imagesrc.toString().length === 0}
              auto
              ghost
              style={{ zIndex: 1 }}
            >
              Download
            </Button>
          </Grid>
          <Grid>
            <Button
              onPress={() => masterReset()}
              color="error"
              disabled={plainFiles.length < 1}
              auto
              ghost
              style={{ zIndex: 1 }}
            >
              Reset
            </Button>
          </Grid>
        </Grid.Container>
        <Features description={meta.description} />
        {isViewerOpen && (
          <div style={{ zIndex: "9999" }}>
            <ImageViewer
              src={[currentImage]}
              currentIndex={0}
              onClose={closeImageViewer}
              disableScroll={false}
              backgroundStyle={{
                backgroundColor: "rgba(0,0,0,0.9)",
              }}
              closeOnClickOutside={true}
            />
          </div>
        )}
      </ToolsLayout>
    </>
  );
};

function Features({ description }) {
  return (
    <>
      <Spacer y={3} />
      <h2>About this tool</h2>
      <p style={{ whiteSpace: "pre-line" }}>{description}</p>

      <Spacer y={1} />
      <h3 style={{ color: "#ff4ecd" }}>Easy to use</h3>
      <p>
        The tool is realy easy to use. Our clean and minimalistic ui design
        makes it realy easy to understand and use the tool.
      </p>
      <h3 style={{ color: "#f5a524" }}>No limits</h3>
      <p>
        We do not limit the size of file you upload. Upload and convert
        unlimited files with unlimited size write into your browser.
      </p>
      <h3 style={{ color: "#17c964" }}>Secure</h3>
      <p>
        All the conversion happens write into your browser. No image/images is
        sent to the server. So your data is secure.
      </p>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  resolvedUrl,
}) => {
  const manifest = await fetchDocsManifest();
  const route = manifest && findRouteByPath(resolvedUrl, manifest.routes);
  return {
    props: {
      routes: manifest.routes,
      currentRoute: route,
    },
  };
};

export default DocsPage;

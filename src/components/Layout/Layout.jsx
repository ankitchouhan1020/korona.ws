import React, { useState } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider, darkThemePrimitives, createTheme, DarkTheme, lightThemePrimitives } from 'baseui';
import { Map, Figures, DataElement, Contributors } from '../../components';

import { Layer } from 'baseui/layer';
import { Button, KIND, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { Modal, ModalHeader, ModalBody, ROLE } from 'baseui/modal';
import { Paragraph3, Label2 } from 'baseui/typography';

import { DataProvider } from './../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import { StyledLink } from 'baseui/link';

const engine = new Styletron();

const { typography, ...rest } = DarkTheme;

const lightTheme = createTheme({ ...lightThemePrimitives, primaryFontFamily: 'Rubik' }, {});
const darkTheme = createTheme({ ...darkThemePrimitives, primaryFontFamily: 'Rubik' }, { ...rest });

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const { useDarkTheme, setUseDarkTheme } = useTheme();

  return (
    <StyletronProvider value={engine}>
      <BaseProvider
        theme={useDarkTheme ? darkTheme : lightTheme}
        overrides={{
          LayersContainer: {
            props: {
              "data-theme": useDarkTheme ? 'dark' : 'light'
            }
          }
        }}
      >
        <DataProvider>
          <Layer>
            <Map className={useDarkTheme ? 'dark-theme' : ''} />
          </Layer>
          <Layer>
            <Block position={'fixed'} top={0} left={0} width={['100%', '100%', 'auto']} margin={['0', '0', '40px']}>
              <Figures />
            </Block>
          </Layer>
          <Layer>
            <Block display={['none', 'none', 'none', 'block']} position={'fixed'} top={'40px'} right={'40px'} $style={{ textAlign: 'right' }}>
              <DataElement />
              <Button
                $as="a"
                target="_blank"
                href="https://www.mohfw.gov.in/"
                kind={KIND.secondary}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      borderRadius: $theme.borders.radius200,
                      boxShadow: $theme.lighting.shadow500,
                      marginTop: '20px'
                    })
                  }
                }}
              >
                More information on Coronavirus
              </Button>
            </Block>
          </Layer>
          <Layer>
            <Block position={'fixed'} bottom={'40px'} right={'40px'} display="flex">
              <div className="fb-share-button" data-href="https://corona-india.netlify.com" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fkorona.ws%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">Share</a></div>
              <Button
                size={SIZE.mini}
                onClick={() => setIsOpen(true)}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      borderRadius: $theme.borders.radius200,
                      boxShadow: $theme.lighting.shadow500,
                      marginLeft: '10px'
                    })
                  }
                }}
              >
                Information
              </Button>
              <Button
                size={SIZE.mini}
                onClick={() => setUseDarkTheme(!useDarkTheme)}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      borderRadius: $theme.borders.radius200,
                      boxShadow: $theme.lighting.shadow500,
                      marginLeft: '10px'
                    })
                  }
                }}
              >
                Turn {useDarkTheme ? ' off ' : ' on '} dark mode
              </Button>
              <Modal
                onClose={() => setIsOpen(false)}
                closeable
                isOpen={isOpen}
                animate
                role={ROLE.dialog}
                overrides={{
                  Dialog: {
                    style: ({ $theme }) => ({
                      borderRadius: $theme.borders.radius200
                    })
                  }
                }}
              >
                <ModalHeader>Information</ModalHeader>
                <ModalBody>
                  <Paragraph3>
                  The author is not responsible for the topicality and correctness of the content provided. The data may be out of date.
                  </Paragraph3>
                  <Paragraph3>
                    Original Autor: Konrad Kalemba<br />
                    Contact: <StyledLink target="_blank" href="mailto:admin@korona.ws">
                      admin@korona.ws                    
                    </StyledLink>
                    <br></br>
                    Information about cases in India is provided by Ankit Chouhan.
                    Contact : <StyledLink target="_blank" href="https://ankitchouhan.me">
                      ankitchouhan.me                   
                    </StyledLink>
                  </Paragraph3>
                  <Paragraph3>
                  The application is "open-source" - anyone willing can directly help in the development of the project. Source code can be found at the following link:
                  </Paragraph3>
                  <StyledLink target="_blank" href="https://github.com/ankitchouhan1020/corona">
                    https://github.com/ankitchouhan1020/corona
                  </StyledLink>

                  <Label2 margin="20px 0 10px">Contributors</Label2>
                  <Contributors />
                </ModalBody>
              </Modal>
            </Block>
          </Layer>
        </DataProvider>
      </BaseProvider>
    </StyletronProvider>
  );
}
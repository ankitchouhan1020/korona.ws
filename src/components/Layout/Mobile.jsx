import React, { useState } from 'react';
import { Map, DataElement, Contributors } from '../../components';

import { useStyletron } from 'baseui';
import { Layer } from 'baseui/layer';
import { Button, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { Modal, ModalHeader, ModalBody, ROLE } from 'baseui/modal';
import { Paragraph3, Label2, HeadingSmall } from 'baseui/typography';

import { useTheme } from '../../contexts/ThemeContext';
import { StyledLink } from 'baseui/link';
import { Tabs, Tab } from 'baseui/tabs';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Figure } from '../Figures/Figures';
import { useData } from '../../contexts/DataContext';

function CustomTab(props) {
  return (
    <Tab
      overrides={{
        Tab: {
          style: {
            flexGrow: 1,
            textAlign: 'center',
            padding: '10px 0'
          }
        }
      }}
      {...props}
    />
  )
}

export default function Mobile() {
  const { cases, cures, deaths, hospitalizations, quarantines, supervisions, tests, isLoading } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const { useDarkTheme, setUseDarkTheme } = useTheme();
  const [activeKey, setActiveKey] = useState('0');
  const [css, theme] = useStyletron();

  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw'
      })}
    >
      <div
        className={css({
          backgroundColor: theme.colors.backgroundPrimary,
          padding: theme.sizing.scale600,
          paddingBottom: 0
        })}
      >
        <HeadingSmall margin={0}>Coronavirus in India</HeadingSmall>
        <FlexGrid flexGridColumnCount={3}>
          <FlexGridItem>
            <Figure
              data={deaths}
              isLoading={isLoading}
              label="Death"
              color={theme.colors.primary}
              size="compact"
            />
          </FlexGridItem>
          <FlexGridItem>
            <Figure
              data={cases}
              isLoading={isLoading}
              label="Confirmed Cases"
              color={theme.colors.negative}
              size="compact"
            />
          </FlexGridItem>
          <FlexGridItem>
            <Figure
              data={cures}
              isLoading={isLoading}
              label="Cured"
              color={theme.colors.positive}
              size="compact"
            />
          </FlexGridItem>
        </FlexGrid>
      </div>

      <Tabs
        onChange={({ activeKey }) => {
          setActiveKey(activeKey);
        }}
        activeKey={activeKey}
        overrides={{
          Root: {
            style: {
              flexGrow: 1,
              display: 'flex'
            }
          },
          TabBar: {
            style: {
              display: 'flex'
            }
          },
          TabContent: {
            style: ({ $active }) => {
              return {
                backgroundColor: theme.colors.backgroundPrimary,
                padding: 0,
                flexGrow: 1,
                display: $active ? 'flex' : 'none',
                width: '100vw'
              };
            }
          }
        }}
      >
        <CustomTab title="Maps">
          <Map className={useDarkTheme ? 'dark-theme' : ''} style={{ height: '100%' }} />
        </CustomTab>
        <CustomTab title="Statistics">
          <div
            className={css({
              padding: theme.sizing.scale600,
              height: 'auto'
            })}
          >
            <FlexGrid flexGridColumnCount={2}>
              <FlexGridItem>
                <Figure
                data={hospitalizations}
                isLoading={isLoading}
                label="Hospitalized"
                color={theme.colors.accent}
                size="compact"
                />
              </FlexGridItem>
              <FlexGridItem>
                <Figure
                data={quarantines}
                isLoading={isLoading}
                label="Symptomatic"
                color={theme.colors.accent}
                size="compact"
                />
              </FlexGridItem>
              <FlexGridItem>
                <Figure
                data={supervisions}
                isLoading={isLoading}
                label="Covered by community surveillance"
                color={theme.colors.accent}
                size="compact"
                />
              </FlexGridItem>
              <FlexGridItem>
                <Figure
                data={tests}
                isLoading={isLoading}
                label="Screened at airport "
                color={theme.colors.accent}
                size="compact"
                />
              </FlexGridItem>
            </FlexGrid>

            <DataElement />
          </div>
        </CustomTab>
      </Tabs>
      <Layer>
        <Block position={'fixed'} bottom={'16px'} left={'0px'} display="flex">
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
    </div>
  );
}
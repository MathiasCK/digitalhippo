import { formatPrice } from "../../lib/utils";
import { Product } from "../../payload-types";
import * as styles from "./email-styles";

import {
  Body,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  render,
} from "@react-email/components";

import * as React from "react";

import { format } from "date-fns";

interface ReceiptEmailProps {
  email: string;
  date: Date;
  orderId: string;
  products: Product[];
}

const ReceiptEmail = ({
  email,
  date,
  orderId,
  products,
}: ReceiptEmailProps) => {
  const fee = 1;
  const total =
    products.reduce((total, currProd) => total + currProd.price, 0) + fee;
  return (
    <Html>
      <Head />
      <Preview>Your DigitalHippo Receipt</Preview>

      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section>
            <Column>
              <Img
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/hippo-email-sent.png`}
                width="100"
                height="100"
                alt="DigitalHippo"
              />
            </Column>

            <Column align="right" style={styles.tableCell}>
              <Text style={styles.heading}>Receipt</Text>
            </Column>
          </Section>
          <Section style={styles.informationTable}>
            <Row style={styles.informationTableRow}>
              <Column style={styles.informationTableColumn}>
                <Text style={styles.informationTableLabel}>EMAIL</Text>
                <Link
                  style={{
                    ...styles.informationTableValue,
                  }}
                >
                  {email}
                </Link>
              </Column>

              <Column style={styles.informationTableColumn}>
                <Text style={styles.informationTableLabel}>INVOICE DATE</Text>
                <Text style={styles.informationTableValue}>
                  {format(date, "dd MMM yyyy")}
                </Text>
              </Column>

              <Column style={styles.informationTableColumn}>
                <Text style={styles.informationTableLabel}>ORDER ID</Text>
                <Link
                  style={{
                    ...styles.informationTableValue,
                  }}
                >
                  {orderId}
                </Link>
              </Column>
            </Row>
          </Section>
          <Section style={styles.productTitleTable}>
            <Text style={styles.productsTitle}>Order Summary</Text>
          </Section>
          {products.map(product => {
            const { image } = product.images[0];

            return (
              <Section key={product.id}>
                <Column style={{ width: "64px" }}>
                  {typeof image !== "string" && image.url ? (
                    <Img
                      src={image.url}
                      width="64"
                      height="64"
                      alt="Product Image"
                      style={styles.productIcon}
                    />
                  ) : null}
                </Column>
                <Column style={{ paddingLeft: "22px" }}>
                  <Text style={styles.productTitle}>{product.name}</Text>
                  {product.description ? (
                    <Text style={styles.productDescription}>
                      {product.description.length > 50
                        ? product.description?.slice(0, 50) + "..."
                        : product.description}
                    </Text>
                  ) : null}
                  <Link
                    href={`${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderId}`}
                    style={styles.productLink}
                  >
                    Download Asset
                  </Link>
                </Column>

                <Column style={styles.productPriceWrapper} align="right">
                  <Text style={styles.productPrice}>
                    {formatPrice(product.price)}
                  </Text>
                </Column>
              </Section>
            );
          })}

          <Section>
            <Column style={{ width: "64px" }}></Column>
            <Column style={{ paddingLeft: "40px", paddingTop: 20 }}>
              <Text style={styles.productTitle}>Transaction Fee</Text>
            </Column>

            <Column style={styles.productPriceWrapper} align="right">
              <Text style={styles.productPrice}>{formatPrice(1)}</Text>
            </Column>
          </Section>

          <Hr style={styles.productPriceLine} />
          <Section align="right">
            <Column style={styles.tableCell} align="right">
              <Text style={styles.productPriceTotal}>TOTAL</Text>
            </Column>
            <Column style={styles.productPriceVerticalLine}></Column>
            <Column style={styles.productPriceLargeWrapper}>
              <Text style={styles.productPriceLarge}>{formatPrice(total)}</Text>
            </Column>
          </Section>
          <Hr style={styles.productPriceLineBottom} />

          <Text style={styles.footerLinksWrapper}>
            <Link href="#">Account Settings</Link> •{" "}
            <Link href="#">Terms of Sale</Link> •{" "}
            <Link href="#">Privacy Policy </Link>
          </Text>
          <Text style={styles.footerCopyright}>
            Copyright © 2023 DigitalHippo Inc. <br />{" "}
            <Link href="#">All rights reserved</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const ReceiptEmailHtml = (props: ReceiptEmailProps) =>
  render(<ReceiptEmail {...props} />, {
    pretty: true,
  });

export default ReceiptEmailHtml;
